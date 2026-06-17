import copy
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import Resume
from .schemas import create_empty_resume, RESUME_UPDATABLE_FIELDS
from .serializers import ResumeSerializer
from pdf_engine.renderer import PDFRenderer
from templates_engine.models import ResumeTemplate

def serialize_resume(resume_obj):
    """Convert Django Resume model to JSON-serializable dict matching frontend expectations."""
    if resume_obj is None:
        return None
    
    # Base dictionary from the data JSONField
    doc = copy.deepcopy(resume_obj.data)
    
    # Add root level attributes
    doc['id'] = str(resume_obj.id)
    doc['title'] = resume_obj.title
    doc['template_id'] = resume_obj.template_id
    doc['user_id'] = resume_obj.user.id
    doc['created_at'] = resume_obj.created_at.isoformat()
    doc['updated_at'] = resume_obj.updated_at.isoformat()
    
    return doc

class ResumeListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        resumes = Resume.objects.filter(user=request.user).order_by('-updated_at')
        result = [serialize_resume(doc) for doc in resumes]
        return Response(result)

    def post(self, request):
        serializer = ResumeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create empty base data structure
        empty_data = create_empty_resume(
            user_id=request.user.id,
            title=serializer.validated_data.get('title', 'Untitled Resume'),
            template_id=serializer.validated_data.get('template_id', 1),
        )
        
        # We don't store these in the JSONField anymore as they are on the model
        del empty_data['title']
        del empty_data['template_id']
        del empty_data['user_id']
        if 'created_at' in empty_data: del empty_data['created_at']
        if 'updated_at' in empty_data: del empty_data['updated_at']

        # Update with provided data
        for field in RESUME_UPDATABLE_FIELDS:
            if field in serializer.validated_data and field not in ['title', 'template_id']:
                empty_data[field] = serializer.validated_data[field]

        resume = Resume.objects.create(
            user=request.user,
            title=serializer.validated_data.get('title', 'Untitled Resume'),
            template_id=serializer.validated_data.get('template_id', 1),
            data=empty_data
        )

        return Response(serialize_resume(resume), status=status.HTTP_201_CREATED)

class ResumeDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resume_id):
        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response(serialize_resume(resume))

    def put(self, request, resume_id):
        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ResumeSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if 'title' in serializer.validated_data:
            resume.title = serializer.validated_data['title']
        if 'template_id' in serializer.validated_data:
            resume.template_id = serializer.validated_data['template_id']

        # Update data dict
        for field in RESUME_UPDATABLE_FIELDS:
            if field in serializer.validated_data and field not in ['title', 'template_id']:
                resume.data[field] = serializer.validated_data[field]
                
        resume.save()
        return Response(serialize_resume(resume))

    def delete(self, request, resume_id):
        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
            resume.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)

class ResumeDuplicateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, resume_id):
        try:
            doc = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Create a copy
        new_resume = Resume.objects.create(
            user=request.user,
            title=f"{doc.title} (Copy)",
            template_id=doc.template_id,
            data=copy.deepcopy(doc.data)
        )

        return Response(serialize_resume(new_resume), status=status.HTTP_201_CREATED)

class ResumeDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resume_id):
        try:
            doc = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            template = ResumeTemplate.objects.get(id=doc.template_id)
            template_slug = template.slug
        except ResumeTemplate.DoesNotExist:
            return Response({'error': 'Template not found.'}, status=status.HTTP_400_BAD_REQUEST)

        # Reconstruct dict for rendering
        render_data = copy.deepcopy(doc.data)
        render_data['title'] = doc.title
        
        try:
            pdf_bytes = PDFRenderer.render_pdf(template_slug, render_data)
            
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            filename = doc.title.replace(' ', '_')
            response['Content-Disposition'] = f'attachment; filename="{filename}.pdf"'
            return response
            
        except Exception as e:
            return Response({'error': f'PDF Generation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
