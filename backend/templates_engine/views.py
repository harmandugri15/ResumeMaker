"""
Views for browsing and previewing resume templates.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from jinja2 import Template as Jinja2Template

from .models import ResumeTemplate
from .serializers import ResumeTemplateListSerializer, ResumeTemplateDetailSerializer


# Sample data for template previews
SAMPLE_RESUME_DATA = {
    'personal_info': {
        'full_name': 'Alex Johnson',
        'email': 'alex.johnson@email.com',
        'phone': '(555) 123-4567',
        'location': 'San Francisco, CA',
        'linkedin': 'linkedin.com/in/alexjohnson',
        'portfolio': 'alexjohnson.dev',
    },
    'summary': (
        'Results-driven software engineer with 5+ years of experience building '
        'scalable web applications. Specialized in Python, React, and cloud '
        'architecture. Led teams of 4-8 engineers delivering products serving '
        '2M+ users. Passionate about clean code, mentorship, and continuous improvement.'
    ),
    'experience': [
        {
            'company': 'TechCorp Inc.',
            'title': 'Senior Software Engineer',
            'start_date': 'Jan 2022',
            'end_date': 'Present',
            'location': 'San Francisco, CA',
            'bullets': [
                'Architected and built a microservices platform reducing deployment time by 60%',
                'Led a team of 6 engineers delivering a real-time analytics dashboard serving 500K daily users',
                'Implemented CI/CD pipelines reducing production bugs by 40% and release cycles from 2 weeks to 2 days',
                'Mentored 3 junior developers, all promoted within 18 months',
            ],
        },
        {
            'company': 'StartupXYZ',
            'title': 'Software Engineer',
            'start_date': 'Jun 2019',
            'end_date': 'Dec 2021',
            'location': 'Remote',
            'bullets': [
                'Built RESTful APIs handling 10K+ requests/second using Django and PostgreSQL',
                'Developed responsive React frontend improving mobile engagement by 35%',
                'Reduced AWS infrastructure costs by 25% through optimization and auto-scaling',
            ],
        },
    ],
    'education': [
        {
            'institution': 'University of California, Berkeley',
            'degree': 'Bachelor of Science',
            'field': 'Computer Science',
            'graduation_date': 'May 2019',
            'gpa': '3.8',
            'honors': 'Magna Cum Laude',
        },
    ],
    'skills': {
        'technical': ['Python', 'JavaScript', 'TypeScript', 'React', 'Django', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
        'soft': ['Team Leadership', 'Mentoring', 'Agile/Scrum', 'Technical Writing'],
        'languages': ['English (Native)', 'Spanish (Conversational)'],
        'tools': ['Git', 'JIRA', 'Figma', 'VS Code', 'DataDog'],
    },
    'certifications': [
        {'name': 'AWS Solutions Architect', 'issuer': 'Amazon Web Services', 'date': '2023'},
        {'name': 'Professional Scrum Master I', 'issuer': 'Scrum.org', 'date': '2022'},
    ],
    'projects': [
        {
            'name': 'OpenTracker',
            'description': 'Open-source project management tool with real-time collaboration features',
            'technologies': ['React', 'Node.js', 'WebSocket', 'MongoDB'],
            'url': 'github.com/alexj/opentracker',
        },
    ],
    'publications': [],
    'custom_sections': [],
}


class TemplateListView(generics.ListAPIView):
    """List all active resume templates."""

    permission_classes = [permissions.AllowAny]
    serializer_class = ResumeTemplateListSerializer
    queryset = ResumeTemplate.objects.filter(is_active=True)

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class TemplateDetailView(generics.RetrieveAPIView):
    """Get full template details including HTML/CSS content."""

    permission_classes = [permissions.AllowAny]
    serializer_class = ResumeTemplateDetailSerializer
    queryset = ResumeTemplate.objects.filter(is_active=True)
    lookup_field = 'slug'


class TemplatePreviewView(APIView):
    """Render a template preview with sample data."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            template = ResumeTemplate.objects.get(slug=slug, is_active=True)
        except ResumeTemplate.DoesNotExist:
            return Response(
                {'error': 'Template not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Read template files
            with open(template.template_html_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            with open(template.template_css_path, 'r', encoding='utf-8') as f:
                css_content = f.read()

            # Render with Jinja2 using sample data
            jinja_template = Jinja2Template(html_content)
            rendered_html = jinja_template.render(**SAMPLE_RESUME_DATA)

            return Response({
                'html': rendered_html,
                'css': css_content,
                'template': ResumeTemplateListSerializer(template).data,
            })

        except FileNotFoundError:
            return Response(
                {'error': 'Template files not found.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TemplateLiveRenderView(APIView):
    """Render a template preview using data from the frontend builder."""

    permission_classes = [permissions.AllowAny] # Change to IsAuthenticated if needed

    def post(self, request, id):
        try:
            template = ResumeTemplate.objects.get(id=id, is_active=True)
        except ResumeTemplate.DoesNotExist:
            return Response(
                {'error': 'Template not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Read template files
            with open(template.template_html_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            with open(template.template_css_path, 'r', encoding='utf-8') as f:
                css_content = f.read()

            # The frontend sends standard JSON matching schemas.py
            resume_data = request.data

            # Render with Jinja2 using live data
            jinja_template = Jinja2Template(html_content)
            rendered_html = jinja_template.render(**resume_data)

            return Response({
                'html': rendered_html,
                'css': css_content,
            })

        except FileNotFoundError:
            return Response(
                {'error': 'Template files not found.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
