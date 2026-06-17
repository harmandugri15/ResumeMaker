"""
Serializers for resume templates.
"""
from rest_framework import serializers
from .models import ResumeTemplate


class ResumeTemplateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for template listing."""

    category_display = serializers.CharField(
        source='get_category_display', read_only=True
    )

    class Meta:
        model = ResumeTemplate
        fields = [
            'id', 'name', 'slug', 'category', 'category_display',
            'description', 'accent_color', 'preview_image',
            'is_ats_friendly', 'supports_multi_page'
        ]


class ResumeTemplateDetailSerializer(serializers.ModelSerializer):
    """Full serializer with template content for rendering."""

    category_display = serializers.CharField(
        source='get_category_display', read_only=True
    )
    html_content = serializers.SerializerMethodField()
    css_content = serializers.SerializerMethodField()

    class Meta:
        model = ResumeTemplate
        fields = [
            'id', 'name', 'slug', 'category', 'category_display',
            'description', 'accent_color', 'preview_image',
            'is_ats_friendly', 'supports_multi_page',
            'html_content', 'css_content'
        ]

    def get_html_content(self, obj):
        """Read the HTML template file content."""
        try:
            with open(obj.template_html_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return ''

    def get_css_content(self, obj):
        """Read the CSS stylesheet content."""
        try:
            with open(obj.template_css_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return ''
