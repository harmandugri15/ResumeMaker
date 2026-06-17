import os
import django
import sys

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from templates_engine.models import ResumeTemplate

templates = [
    {
        'name': 'Executive Pro',
        'slug': 'executive-pro',
        'category': 'professional',
        'template_dir': 'executive_pro',
        'accent_color': '#1a365d',
    },
    {
        'name': 'Corporate Edge',
        'slug': 'corporate-edge',
        'category': 'professional',
        'template_dir': 'corporate_edge',
        'accent_color': '#2d3748',
    },
    {
        'name': 'Modern Stack',
        'slug': 'modern-stack',
        'category': 'creative',
        'template_dir': 'modern_stack',
        'accent_color': '#0d9488',
    },
    {
        'name': 'Design Forward',
        'slug': 'design-forward',
        'category': 'creative',
        'template_dir': 'design_forward',
        'accent_color': '#e76f51',
    },
    {
        'name': 'Pixel Perfect',
        'slug': 'pixel-perfect',
        'category': 'creative',
        'template_dir': 'pixel_perfect',
        'accent_color': '#22c55e',
    },
    {
        'name': 'Clean Slate',
        'slug': 'clean-slate',
        'category': 'minimalist',
        'template_dir': 'clean_slate',
        'accent_color': '#000000',
    },
    {
        'name': 'Simple Impact',
        'slug': 'simple-impact',
        'category': 'minimalist',
        'template_dir': 'simple_impact',
        'accent_color': '#000000',
    },
    {
        'name': 'Swiss Design',
        'slug': 'swiss-design',
        'category': 'minimalist',
        'template_dir': 'swiss_design',
        'accent_color': '#dc2626',
    },
    {
        'name': 'Academic CV',
        'slug': 'academic-cv',
        'category': 'academic',
        'template_dir': 'academic_cv',
        'accent_color': '#1e40af',
        'supports_multi_page': True,
    },
    {
        'name': 'Research Brief',
        'slug': 'research-brief',
        'category': 'academic',
        'template_dir': 'research_brief',
        'accent_color': '#4b5563',
    },
    {
        'name': 'Fresh Start',
        'slug': 'fresh-start',
        'category': 'entry_level',
        'template_dir': 'fresh_start',
        'accent_color': '#3b82f6',
    },
    {
        'name': 'Campus Ready',
        'slug': 'campus-ready',
        'category': 'entry_level',
        'template_dir': 'campus_ready',
        'accent_color': '#059669',
    }
]

for idx, t_data in enumerate(templates):
    t_data['display_order'] = idx + 1
    ResumeTemplate.objects.update_or_create(
        slug=t_data['slug'],
        defaults=t_data
    )

print("Seeded templates successfully.")
