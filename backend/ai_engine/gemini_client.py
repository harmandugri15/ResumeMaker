"""
AI Client — powered by Groq (free, open-source models).

Groq free tier: 14,400 requests/day — far more than Gemini's 20/day.
Models used (all open-source, all free):
  - llama-3.3-70b-versatile  → best quality, used for tailoring & review
  - llama-3.1-8b-instant     → fastest, used for simple tasks
  - gemma2-9b-it             → fallback

Falls back to Gemini (gemini-2.0-flash-lite) only if ALL Groq models fail.

Features:
- Response caching (6 hours) — identical prompts never hit the API twice
- Per-user rate limiting — 30 AI calls/hour per user
- Smart model waterfall — tries fastest model first, degrades gracefully
"""
import json
import hashlib
import re
import os
from django.conf import settings
from django.core.cache import cache


# ---------------------------------------------------------------------------
# Groq model waterfall — all free, all open-source
# ---------------------------------------------------------------------------
GROQ_MODELS = [
    "llama-3.3-70b-versatile",   # Best quality — for tailoring & review
    "llama-3.1-8b-instant",      # Ultra-fast fallback
    "gemma2-9b-it",              # Google Gemma fallback
    "mixtral-8x7b-32768",        # Mixtral fallback (long context)
]

# Gemini fallback (last resort, free tier only)
GEMINI_FALLBACK_MODEL = "gemini-2.0-flash-lite"

# Cache TTL: 6 hours
CACHE_TTL = 60 * 60 * 6

# Per-user rate limit
USER_RATE_LIMIT = 30   # calls per hour
USER_RATE_WINDOW = 3600


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _cache_key(text: str) -> str:
    return "ai_cache_" + hashlib.sha256(text.encode()).hexdigest()[:32]


def _check_rate_limit(user_id) -> bool:
    if not user_id:
        return True
    key = f"ai_rl_{user_id}"
    count = cache.get(key, 0)
    if count >= USER_RATE_LIMIT:
        return False
    cache.set(key, count + 1, USER_RATE_WINDOW)
    return True


def _clean_json(text: str):
    """Strip markdown fences and parse JSON."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


def _get_groq_client():
    api_key = getattr(settings, "GROQ_API_KEY", None) or os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None  # No Groq key — will fall back to Gemini
    from groq import Groq
    return Groq(api_key=api_key)


def _groq_chat(messages: list, temperature: float = 0.2) -> str | None:
    """Call Groq API with model waterfall. Returns raw text or None."""
    client = _get_groq_client()
    if client is None:
        print("Groq: No API key set — skipping to Gemini fallback")
        return _gemini_fallback(messages[-1]["content"], temperature)

    for model in GROQ_MODELS:
        try:
            completion = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=4096,
            )
            print(f"Groq: Success with [{model}]")
            return completion.choices[0].message.content
        except Exception as e:
            err = str(e)
            if "429" in err or "rate_limit" in err.lower() or "quota" in err.lower():
                print(f"Groq: Rate limit on [{model}], trying next…")
                continue
            print(f"Groq: Error on [{model}]: {e}")
            break

    # All Groq models failed — try Gemini as last resort
    return _gemini_fallback(messages[-1]["content"], temperature)


def _gemini_fallback(prompt: str, temperature: float) -> str | None:
    """Last-resort: Gemini free tier (gemini-2.0-flash-lite)."""
    try:
        from google import genai
        from google.genai import types
        api_key = getattr(settings, "GEMINI_API_KEY", None) or os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return None
        client = genai.Client(api_key=api_key)
        config = types.GenerateContentConfig(temperature=temperature)
        response = client.models.generate_content(
            model=GEMINI_FALLBACK_MODEL,
            contents=prompt,
            config=config
        )
        print(f"Gemini fallback: Success with [{GEMINI_FALLBACK_MODEL}]")
        return response.text
    except Exception as e:
        print(f"Gemini fallback failed: {e}")
        return None


# ---------------------------------------------------------------------------
# Public API (same signatures as old gemini_client.py)
# ---------------------------------------------------------------------------

def generate_structured_data(prompt, schema_dict, system_instruction=None, user_id=None):
    """
    Generate structured JSON data matching a specific schema.
    Cached for 6 hours — identical prompts never hit the API twice.
    """
    full_prompt = (
        f"{prompt}\n\n"
        f"Return ONLY raw JSON (no markdown, no code blocks) that exactly matches "
        f"this schema:\n{json.dumps(schema_dict, indent=2)}"
    )

    # Cache check
    key = _cache_key(full_prompt)
    cached = cache.get(key)
    if cached is not None:
        print("AI cache HIT — skipping API call")
        return cached

    # Rate limit check
    if not _check_rate_limit(user_id):
        print(f"AI rate limit exceeded for user {user_id}")
        return None

    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": full_prompt})

    raw = _groq_chat(messages, temperature=0.2)
    if raw is None:
        return None

    try:
        result = _clean_json(raw)
        cache.set(key, result, CACHE_TTL)
        return result
    except json.JSONDecodeError:
        print(f"AI: JSON parse failed. Raw response:\n{raw[:300]}")
        return None


def generate_text(prompt, system_instruction=None, temperature=0.7, user_id=None):
    """
    Generate plain text response.
    Cached for 6 hours.
    """
    key = _cache_key(prompt + str(temperature))
    cached = cache.get(key)
    if cached is not None:
        print("AI cache HIT — skipping API call")
        return cached

    if not _check_rate_limit(user_id):
        print(f"AI rate limit exceeded for user {user_id}")
        return None

    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})

    result = _groq_chat(messages, temperature=temperature)
    if result:
        cache.set(key, result, CACHE_TTL)
    return result
