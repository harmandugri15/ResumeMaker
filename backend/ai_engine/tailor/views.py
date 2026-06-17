"""
API endpoints for Job Tailoring.
"""
import PyPDF2
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from google import genai

from .job_analyzer import JobAnalyzer
from .resume_matcher import ResumeMatcher
from .optimizer import ResumeOptimizer
from resumes.models import Resume
import json


class AnalyzeJobView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        job_description = request.data.get('job_description', '')
        if not job_description:
            return Response({'error': 'job_description is required'}, status=status.HTTP_400_BAD_REQUEST)

        analysis = JobAnalyzer.analyze(job_description)
        return Response(analysis)


class CompareResumeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')
        resume_data_payload = request.data.get('resume_data')
        job_analysis = request.data.get('job_analysis')
        
        if not job_analysis:
            return Response({'error': 'job_analysis is required'}, status=status.HTTP_400_BAD_REQUEST)

        if resume_id:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                resume_data = resume.data
            except Resume.DoesNotExist:
                return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
        elif resume_data_payload:
            resume_data = resume_data_payload
        else:
            return Response({'error': 'resume_id or resume_data is required'}, status=status.HTTP_400_BAD_REQUEST)

        match_result = ResumeMatcher.match(resume_data, job_analysis)
        return Response(match_result)


class OptimizeResumeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')
        resume_data_payload = request.data.get('resume_data')
        job_analysis = request.data.get('job_analysis')
        
        if not job_analysis:
            return Response({'error': 'job_analysis is required'}, status=status.HTTP_400_BAD_REQUEST)

        if resume_id:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                resume_data = resume.data
            except Resume.DoesNotExist:
                return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
        elif resume_data_payload:
            resume_data = resume_data_payload
        else:
            return Response({'error': 'resume_id or resume_data is required'}, status=status.HTTP_400_BAD_REQUEST)

        industry = 'general' # user.industry might not exist
        optimized_sections = ResumeOptimizer.optimize(resume_data, job_analysis, industry)
        
        return Response(optimized_sections)


class ParseUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        pdf_file = request.FILES['file']
        
        try:
            reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
                
            from ai_engine.gemini_client import generate_structured_data
            
            prompt = f"""
            You are a resume parser. Extract the information from the following resume text and map it into this EXACT JSON structure. Ensure all fields exist even if empty. Do NOT include markdown code blocks around your response, return ONLY raw JSON.
            
            Resume Text:
            {text}
            """
            
            schema = {
              "personal_info": {"full_name": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": ""},
              "summary": "",
              "experience": [ {"company": "", "title": "", "start_date": "", "end_date": "", "location": "", "bullets": [""]} ],
              "education": [ {"institution": "", "degree": "", "field": "", "graduation_date": "", "gpa": "", "honors": ""} ],
              "skills": {"technical": [], "soft": [], "languages": [], "tools": []},
              "certifications": [ {"name": "", "issuer": "", "date": ""} ],
              "projects": [ {"name": "", "description": "", "technologies": [], "url": ""} ]
            }
            
            parsed_json = generate_structured_data(prompt, schema)
            if not parsed_json:
                return Response({'error': 'Failed to parse resume due to AI server overload.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                
            return Response({'resume_data': parsed_json})
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
