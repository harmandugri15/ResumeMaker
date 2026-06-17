"""
Resume Generation Engine utilizing Gemini.
"""
from .gemini_client import generate_structured_data
from .prompts.generation_prompts import (
    SYSTEM_RESUME_WRITER,
    GENERATE_EXPERIENCE_BULLETS,
    GENERATE_SUMMARY,
    GENERATE_SKILLS
)
# Note: we will integrate RAG context in Phase 6. For now, rag_context is empty.

class ResumeGenerator:
    """Handles generating resume content from raw input."""

    @staticmethod
    def generate_experience_bullets(company, title, raw_notes, rag_context=""):
        prompt = GENERATE_EXPERIENCE_BULLETS.format(
            company=company,
            title=title,
            raw_notes=raw_notes,
            rag_context=rag_context
        )
        schema = {
            "bullets": [
                "Developed scalable backend APIs using Python",
                "Increased system performance by 20%"
            ]
        }
        
        result = generate_structured_data(
            prompt=prompt,
            schema_dict=schema,
            system_instruction=SYSTEM_RESUME_WRITER
        )
        return result.get("bullets", []) if result else []

    @staticmethod
    def generate_summary(profile_data, experience_data, rag_context=""):
        prompt = GENERATE_SUMMARY.format(
            profile=profile_data,
            experience=experience_data,
            rag_context=rag_context
        )
        schema = {
            "summary": "Results-driven software engineer with..."
        }
        
        result = generate_structured_data(
            prompt=prompt,
            schema_dict=schema,
            system_instruction=SYSTEM_RESUME_WRITER
        )
        return result.get("summary", "") if result else ""

    @staticmethod
    def categorize_skills(raw_skills):
        prompt = GENERATE_SKILLS.format(raw_notes=raw_skills)
        schema = {
            "technical": [],
            "soft": [],
            "languages": [],
            "tools": []
        }
        
        result = generate_structured_data(
            prompt=prompt,
            schema_dict=schema,
            system_instruction=SYSTEM_RESUME_WRITER
        )
        return result if result else schema
