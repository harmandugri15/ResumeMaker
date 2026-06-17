"""
Resume optimization engine using Gemini.
"""
import json
from ai_engine.gemini_client import generate_structured_data
from rag.retrieval_chain import get_rag_context

OPTIMIZE_PROMPT = """
You are an expert resume writer. Rewrite the provided resume to PERFECTLY match the job analysis.
1. DO NOT fabricate any experience. Only rephrase, reorder, and emphasize existing experience so that it closely aligns with the job requirements.
2. AGGRESSIVELY BLEND AND INJECT the key skills, keywords, and tone from the job description into the professional summary and experience bullets.
3. CRITICAL: Whenever you inject a new keyword from the job description, or heavily modify a phrase to match the role, you MUST wrap that specific word or phrase in HTML underline tags like this: <u>keyword</u>. 
   - Example: "Developed a <u>React</u> frontend to improve <u>user retention by 20%</u>."
   - This allows the user to easily spot the changes you made. Do NOT wrap entire sentences, only the specific phrases or keywords changed.

Incorporate relevant best practices from the provided context.

Resume Data:
{resume_data}

Job Analysis:
{job_analysis}

Best Practices Context:
{rag_context}
"""

class ResumeOptimizer:
    @staticmethod
    def optimize(resume_data, job_analysis, industry='general'):
        # Just optimize the summary and experience bullets for now to keep it targeted.
        schema = {
            "summary": "Optimized professional summary...",
            "experience": [
                {
                    "company": "Exact same company name as original",
                    "title": "Exact same title as original",
                    "start_date": "Exact same start_date as original",
                    "end_date": "Exact same end_date as original",
                    "location": "Exact same location as original",
                    "bullets": ["Optimized bullet 1", "Optimized bullet 2"]
                }
            ]
        }
        
        rag_context = get_rag_context(f"resume tailoring job description {industry} best practices")
        
        result = generate_structured_data(
            prompt=OPTIMIZE_PROMPT.format(
                resume_data=json.dumps(resume_data, indent=2),
                job_analysis=json.dumps(job_analysis, indent=2),
                rag_context=rag_context
            ),
            schema_dict=schema,
            system_instruction="You are an expert resume writer tailoring a resume to a specific job description."
        )
        
        return result
