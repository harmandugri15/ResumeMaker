"""
Job description analysis using Gemini.
"""
from ai_engine.gemini_client import generate_structured_data

JOB_ANALYSIS_PROMPT = """
Analyze the following job description. Extract the required skills, experience level, 
key responsibilities, and infer the most critical qualities they are looking for.

Job Description:
{job_description}
"""

class JobAnalyzer:
    @staticmethod
    def analyze(job_description):
        schema = {
            "title": "",
            "seniority_level": "",
            "required_skills": {
                "hard_skills": [],
                "soft_skills": []
            },
            "key_responsibilities": [],
            "critical_qualities": []
        }
        
        result = generate_structured_data(
            prompt=JOB_ANALYSIS_PROMPT.format(job_description=job_description),
            schema_dict=schema,
            system_instruction="You are an expert technical recruiter analyzing job descriptions."
        )
        return result if result else schema
