"""
Models for resume template metadata.
Templates themselves are HTML/CSS files on disk, this model tracks metadata.
"""
from django.db import models


class ResumeTemplate(models.Model):
    """Metadata for an ATS-friendly resume template."""

    CATEGORY_CHOICES = [
        ('professional', 'Professional / Corporate'),
        ('creative', 'Creative / Modern'),
        ('minimalist', 'Minimalist / Clean'),
        ('academic', 'Academic / Research'),
        ('entry_level', 'Entry Level / Student'),
    ]

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, default='')

    # File paths relative to RESUME_TEMPLATES_DIR
    template_dir = models.CharField(
        max_length=200,
        help_text='Directory name within resume_templates/'
    )

    # Visual info
    accent_color = models.CharField(
        max_length=7,
        default='#000000',
        help_text='Primary accent color hex code'
    )
    preview_image = models.ImageField(
        upload_to='template_previews/',
        blank=True,
        null=True
    )

    # Flags
    is_ats_friendly = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    supports_multi_page = models.BooleanField(default=False)

    # Ordering
    display_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Resume Template'
        verbose_name_plural = 'Resume Templates'

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

    @property
    def template_html_path(self):
        """Full path to the template HTML file."""
        from django.conf import settings
        return settings.RESUME_TEMPLATES_DIR / self.template_dir / 'template.html'

    @property
    def template_css_path(self):
        """Full path to the template CSS file."""
        from django.conf import settings
        return settings.RESUME_TEMPLATES_DIR / self.template_dir / 'styles.css'
