"""
WeasyPrint PDF Renderer.
Renders Jinja2 HTML templates into PDFs.
"""
import os
import io
from jinja2 import Template as Jinja2Template
from django.conf import settings
from templates_engine.models import ResumeTemplate

class PDFRenderer:
    @staticmethod
    def render_pdf(template_slug, resume_data):
        """
        Renders a resume into a PDF byte stream using WeasyPrint.
        """
        try:
            template = ResumeTemplate.objects.get(slug=template_slug, is_active=True)
        except ResumeTemplate.DoesNotExist:
            raise ValueError(f"Template '{template_slug}' not found or inactive.")

        # Read template files
        with open(template.template_html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        with open(template.template_css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()

        # Render HTML with Jinja2
        jinja_template = Jinja2Template(html_content)
        rendered_html_str = jinja_template.render(**resume_data)

        # Import weasyprint here to avoid crashing Django startup if GTK3 is missing on Windows
        from weasyprint import HTML, CSS

        # Base URL needed for any relative assets (though ATS templates shouldn't have images)
        base_url = f"file://{settings.RESUME_TEMPLATES_DIR}/"

        # Generate PDF using WeasyPrint
        pdf_bytes = HTML(string=rendered_html_str, base_url=base_url).write_pdf(
            stylesheets=[CSS(string=css_content)]
        )
        
        return pdf_bytes
