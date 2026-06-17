"""
Interview Engine for conducting a conversational AI interview.
Stores conversation state in MongoDB.
"""
from datetime import datetime
from bson import ObjectId
from resumes.mongo_client import get_interview_sessions_collection
from .gemini_client import generate_text
from .prompts.interview_prompts import SYSTEM_INTERVIEWER, INTERVIEW_QUESTION_GENERATOR
from rag.retrieval_chain import get_rag_context

# Basic flow: Welcome -> Personal Info -> Experience -> Education -> Skills -> Done
SECTIONS = ["welcome", "personal_info", "experience", "education", "skills", "done"]

class InterviewEngine:
    
    @staticmethod
    def get_or_create_session(user_id, session_id=None):
        collection = get_interview_sessions_collection()
        if session_id:
            try:
                session = collection.find_one({'_id': ObjectId(session_id), 'user_id': user_id})
                if session:
                    return session
            except:
                pass
        
        # Create new session
        new_session = {
            'user_id': user_id,
            'current_section': 'welcome',
            'history': [], # list of {role: 'ai'|'user', text: string}
            'extracted_data': {},
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = collection.insert_one(new_session)
        new_session['_id'] = result.inserted_id
        return new_session

    @staticmethod
    def process_message(user_id, session_id, message_text, user_profile):
        session = InterviewEngine.get_or_create_session(user_id, session_id)
        collection = get_interview_sessions_collection()
        
        # Add user message to history
        if message_text:
            session['history'].append({'role': 'user', 'text': message_text})
        
        # Prepare context for Gemini
        history_text = ""
        for msg in session['history'][-10:]: # keep last 10 messages for context window
            history_text += f"{msg['role'].upper()}: {msg['text']}\n"
            
        system_prompt = SYSTEM_INTERVIEWER.format(
            current_section=session['current_section'],
            industry=user_profile.industry or 'general',
            experience_level=user_profile.experience_level or 'general',
            rag_context=get_rag_context(f"resume interview questions {session['current_section']} {user_profile.industry or 'general'}")
        )
        
        generation_prompt = INTERVIEW_QUESTION_GENERATOR.format(history=history_text)
        
        # Generate next AI response
        ai_response = generate_text(
            prompt=generation_prompt,
            system_instruction=system_prompt,
            temperature=0.7
        )
        
        if not ai_response:
            ai_response = "I'm sorry, I encountered an error. Could you repeat that?"
            
        # Add AI response to history
        session['history'].append({'role': 'ai', 'text': ai_response})
        session['updated_at'] = datetime.utcnow()
        
        # Save state
        collection.update_one({'_id': session['_id']}, {'$set': {
            'history': session['history'],
            'updated_at': session['updated_at']
        }})
        
        return {
            'session_id': str(session['_id']),
            'reply': ai_response,
            'current_section': session['current_section']
        }
