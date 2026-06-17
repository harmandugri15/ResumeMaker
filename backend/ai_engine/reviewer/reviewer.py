"""
AI Review Engine for uploaded resumes.
"""
from ai_engine.gemini_client import generate_structured_data
from rag.retrieval_chain import get_rag_context

REVIEW_PROMPT = """
You are an expert ATS parser and resume reviewer.
Analyze the following resume text and provide categorized suggestions for improvement.
Focus on Content, Keywords, ATS compatibility, and Impact.

Resume Text:
{resume_text}

Best Practices Context:
{rag_context}
"""

class ResumeReviewer:
    @staticmethod
    def review(resume_text, industry='general'):
        schema = {
            "overall_score": 0, # 0-100
            "suggestions": [
                {
                    "category": "Content|Keywords|ATS|Impact|Format",
                    "severity": "Critical|Important|Nice-to-have",
                    "issue": "Description of the issue",
                    "recommendation": "How to fix it",
                    "before": "Original text (if applicable)",
                    "after": "Suggested replacement (if applicable)"
                }
            ]
        }
        
        rag_context = get_rag_context(f"resume review common mistakes {industry} ATS formatting")
        
        result = generate_structured_data(
            prompt=REVIEW_PROMPT.format(
                resume_text=resume_text,
                rag_context=rag_context
            ),
            schema_dict=schema,
            system_instruction="You are an expert resume reviewer giving actionable, categorized feedback."
        )
        
        if not result:
            return {
                "overall_score": 0,
                "suggestions": [
                    {
                        "category": "System Error",
                        "severity": "Critical",
                        "issue": "AI Review Generation Failed",
                        "recommendation": "The AI model is currently overloaded. Please try again in a few moments.",
                        "before": "",
                        "after": ""
                    }
                ]
            }
            
        return result
