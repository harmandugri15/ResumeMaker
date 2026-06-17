"""
REST serializers for resume data.
Since data comes from MongoDB (not Django ORM), we use plain Serializers.
"""
from rest_framework import serializers


class PersonalInfoSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    email = serializers.CharField(max_length=300, required=False, default='', allow_blank=True)
    phone = serializers.CharField(max_length=30, required=False, default='', allow_blank=True)
    location = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    linkedin = serializers.CharField(max_length=300, required=False, default='', allow_blank=True)
    portfolio = serializers.CharField(max_length=300, required=False, default='', allow_blank=True)


class ExperienceSerializer(serializers.Serializer):
    company = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    title = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    start_date = serializers.CharField(max_length=50, required=False, default='', allow_blank=True)
    end_date = serializers.CharField(max_length=50, required=False, default='', allow_blank=True)
    location = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    bullets = serializers.ListField(
        child=serializers.CharField(max_length=500, allow_blank=True),
        required=False,
        default=list
    )


class EducationSerializer(serializers.Serializer):
    institution = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    degree = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    field = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    graduation_date = serializers.CharField(max_length=100, required=False, default='', allow_blank=True)
    gpa = serializers.CharField(max_length=50, required=False, default='', allow_blank=True)
    honors = serializers.CharField(max_length=500, required=False, default='', allow_blank=True)


class SkillsSerializer(serializers.Serializer):
    technical = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )
    soft = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )
    languages = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )
    tools = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )


class CertificationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    issuer = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    date = serializers.CharField(max_length=50, required=False, default='', allow_blank=True)


class ProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    description = serializers.CharField(max_length=1000, required=False, default='', allow_blank=True)
    technologies = serializers.ListField(
        child=serializers.CharField(max_length=100, allow_blank=True),
        required=False,
        default=list
    )
    url = serializers.CharField(max_length=300, required=False, default='', allow_blank=True)


class CustomSectionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200, required=False, default='', allow_blank=True)
    content = serializers.CharField(max_length=2000, required=False, default='', allow_blank=True)


class ResumeSerializer(serializers.Serializer):
    """Full resume serializer for create/update operations."""
    title = serializers.CharField(max_length=200, required=False, default='Untitled Resume')
    template_id = serializers.IntegerField(required=False, default=1)
    personal_info = PersonalInfoSerializer(required=False)
    summary = serializers.CharField(max_length=5000, required=False, default='', allow_blank=True)
    experience = ExperienceSerializer(many=True, required=False, default=list)
    education = EducationSerializer(many=True, required=False, default=list)
    skills = SkillsSerializer(required=False)
    certifications = CertificationSerializer(many=True, required=False, default=list)
    projects = ProjectSerializer(many=True, required=False, default=list)
    publications = serializers.ListField(
        child=serializers.CharField(max_length=500),
        required=False,
        default=list
    )
    custom_sections = CustomSectionSerializer(many=True, required=False, default=list)


class ResumeResponseSerializer(serializers.Serializer):
    """Serializer for resume responses (includes metadata)."""
    id = serializers.CharField(source='_id')
    title = serializers.CharField()
    template_id = serializers.IntegerField()
    is_base = serializers.BooleanField()
    parent_resume_id = serializers.CharField(allow_null=True)
    personal_info = PersonalInfoSerializer()
    summary = serializers.CharField()
    experience = ExperienceSerializer(many=True)
    education = EducationSerializer(many=True)
    skills = SkillsSerializer()
    certifications = CertificationSerializer(many=True)
    projects = ProjectSerializer(many=True)
    publications = serializers.ListField(child=serializers.CharField())
    custom_sections = CustomSectionSerializer(many=True)
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
