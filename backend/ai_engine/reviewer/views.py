"""
API endpoints for Resume Reviewer.
"""
import os
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser

from .pdf_parser import PDFParser
from .reviewer import ResumeReviewer


class UploadReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file_obj = request.FILES.get('resume_pdf')
        if not file_obj:
            return Response({'error': 'resume_pdf file is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not file_obj.name.lower().endswith('.pdf'):
            return Response({'error': 'Only PDF files are supported'}, status=status.HTTP_400_BAD_REQUEST)

        # Save file temporarily
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'temp_uploads')
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, f"{request.user.id}_{file_obj.name}")
        
        with open(file_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)
                
        # Parse PDF
        parsed_data = PDFParser.parse(file_path)
        
        # Clean up temp file
        if os.path.exists(file_path):
            os.remove(file_path)
            
        if not parsed_data:
            return Response({'error': 'Failed to parse PDF'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Generate review
        industry = request.user.industry or 'general'
        review_results = ResumeReviewer.review(parsed_data['raw_text'], industry)
        
        return Response(review_results)

class AnalyzeReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_data = request.data.get('resume_data')
        if not resume_data:
            return Response({'error': 'resume_data is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        import json
        resume_text = json.dumps(resume_data, indent=2)
        
        industry = request.user.industry or 'general'
        review_results = ResumeReviewer.review(resume_text, industry)
        
        return Response(review_results)
