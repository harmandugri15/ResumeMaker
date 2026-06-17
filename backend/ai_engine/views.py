"""
API endpoints for AI Engine.
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .resume_generator import ResumeGenerator
from .interview_engine import InterviewEngine
from rag.retrieval_chain import get_rag_context

class GenerateBulletsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        company = request.data.get('company', '')
        title = request.data.get('title', '')
        raw_notes = request.data.get('raw_notes', '')
        industry = request.user.industry or 'general'
        
        rag_context = get_rag_context(f"resume experience bullets {industry} best practices")

        if not raw_notes:
            return Response({'error': 'raw_notes is required'}, status=status.HTTP_400_BAD_REQUEST)

        bullets = ResumeGenerator.generate_experience_bullets(
            company=company,
            title=title,
            raw_notes=raw_notes,
            rag_context=rag_context
        )
        
        return Response({'bullets': bullets})


class GenerateSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile_data = request.data.get('profile', str(request.user.industry))
        experience_data = request.data.get('experience', '')
        
        rag_context = get_rag_context(f"resume professional summary {request.user.industry} best practices")

        summary = ResumeGenerator.generate_summary(
            profile_data=profile_data,
            experience_data=experience_data,
            rag_context=rag_context
        )
        
        return Response({'summary': summary})


class CategorizeSkillsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        raw_skills = request.data.get('raw_skills', '')
        if not raw_skills:
             return Response({'error': 'raw_skills is required'}, status=status.HTTP_400_BAD_REQUEST)

        categorized = ResumeGenerator.categorize_skills(raw_skills)
        return Response(categorized)


class InterviewChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        session_id = request.data.get('session_id')
        message_text = request.data.get('message', '')
        
        result = InterviewEngine.process_message(
            user_id=request.user.id,
            session_id=session_id,
            message_text=message_text,
            user_profile=request.user
        )
        
        return Response(result)
