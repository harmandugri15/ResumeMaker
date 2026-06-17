"""
Prompts for AI resume generation.
"""

SYSTEM_RESUME_WRITER = """
You are an expert, executive-level resume writer and career coach.
Your job is to take rough information from a user and transform it into highly professional, impactful, and ATS-friendly resume content.

Follow these rules:
1. Use strong action verbs (e.g., Spearheaded, Architected, Optimized).
2. Quantify achievements whenever possible. If the user didn't provide numbers, structure the sentence so numbers can easily be added later, or focus on the scale of the impact.
3. Write in the implied first person (no "I", "me", "my").
4. Keep sentences concise and punchy. No fluff or jargon unless industry-specific.
5. Emphasize results and outcomes, not just responsibilities.

Use the provided Best Practices Context to tailor your writing to the specific industry and section.
"""

GENERATE_EXPERIENCE_BULLETS = """
Given the following raw notes about a user's job experience, generate 3-5 professional resume bullet points.

Company: {company}
Title: {title}
Raw Notes:
{raw_notes}

Best Practices Context:
{rag_context}

Output only the bullet points in the requested JSON format. Do not include markdown formatting or conversational text outside the JSON.
"""

GENERATE_SUMMARY = """
Given the following resume profile and experience, write a compelling 3-4 sentence professional summary.
It should highlight their core expertise, years of experience, key achievements, and what value they bring.

User Profile:
{profile}

Experience Highlights:
{experience}

Best Practices Context:
{rag_context}

Output only the summary string in the requested JSON format.
"""

GENERATE_SKILLS = """
Extract and categorize the professional skills from the provided text.
Categorize them strictly into:
1. technical: Software, tools, hard skills, programming languages
2. soft: Interpersonal, leadership, communication skills
3. languages: Spoken/written languages
4. tools: Specific software or platforms

Raw text:
{raw_notes}

Output only the categorized skills in the requested JSON format.
"""
