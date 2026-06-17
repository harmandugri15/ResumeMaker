"""
Resume matching engine using Gemini.
"""
import json
from ai_engine.gemini_client import generate_structured_data

RESUME_MATCH_PROMPT = """
Compare the candidate's resume with the target job analysis.
Identify matching skills, missing skills, and calculate a match percentage (0-100).
Highlight specific areas where the resume could be improved to better fit the job.

Resume Data:
{resume_data}

Job Analysis:
{job_analysis}
"""

class ResumeMatcher:
    @staticmethod
    def match(resume_data, job_analysis):
        schema = {
            "match_percentage": 0,
            "matching_skills": [],
            "missing_skills": [],
            "improvement_areas": [
                {
                    "section": "",
                    "suggestion": ""
                }
            ]
        }
        
        result = generate_structured_data(
            prompt=RESUME_MATCH_PROMPT.format(
                resume_data=json.dumps(resume_data, indent=2),
                job_analysis=json.dumps(job_analysis, indent=2)
            ),
            schema_dict=schema,
            system_instruction="You are an expert ATS and technical recruiter evaluating a candidate's fit for a role."
        )
        return result if result else schema
