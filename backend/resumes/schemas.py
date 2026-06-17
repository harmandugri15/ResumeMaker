"""
Resume document schemas for validation.
Defines the structure of resume documents stored in MongoDB.
"""
from datetime import datetime


def create_empty_resume(user_id, title='Untitled Resume', template_id=1):
    """Create a new empty resume document."""
    return {
        'user_id': user_id,
        'title': title,
        'template_id': template_id,
        'is_base': True,
        'parent_resume_id': None,
        'personal_info': {
            'full_name': '',
            'email': '',
            'phone': '',
            'location': '',
            'linkedin': '',
            'portfolio': '',
        },
        'summary': '',
        'experience': [],
        'education': [],
        'skills': {
            'technical': [],
            'soft': [],
            'languages': [],
            'tools': [],
        },
        'certifications': [],
        'projects': [],
        'publications': [],
        'custom_sections': [],
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
    }


def create_experience_entry():
    """Create an empty experience entry."""
    return {
        'company': '',
        'title': '',
        'start_date': '',
        'end_date': '',
        'location': '',
        'bullets': [],
    }


def create_education_entry():
    """Create an empty education entry."""
    return {
        'institution': '',
        'degree': '',
        'field': '',
        'graduation_date': '',
        'gpa': '',
        'honors': '',
    }


def create_certification_entry():
    """Create an empty certification entry."""
    return {
        'name': '',
        'issuer': '',
        'date': '',
    }


def create_project_entry():
    """Create an empty project entry."""
    return {
        'name': '',
        'description': '',
        'technologies': [],
        'url': '',
    }


RESUME_UPDATABLE_FIELDS = [
    'title', 'template_id', 'personal_info', 'summary',
    'experience', 'education', 'skills', 'certifications',
    'projects', 'publications', 'custom_sections',
]
