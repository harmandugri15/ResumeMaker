"""
Custom User model with profile fields for the Resume Maker.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended user model with resume-relevant profile data."""

    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level / Student'),
        ('mid', 'Mid Level (2-5 years)'),
        ('senior', 'Senior Level (5-10 years)'),
        ('executive', 'Executive / Leadership (10+ years)'),
    ]

    INDUSTRY_CHOICES = [
        ('technology', 'Technology'),
        ('finance', 'Finance & Banking'),
        ('healthcare', 'Healthcare'),
        ('marketing', 'Marketing & Advertising'),
        ('engineering', 'Engineering'),
        ('education', 'Education'),
        ('sales', 'Sales & Business Development'),
        ('design', 'Design'),
        ('legal', 'Legal'),
        ('consulting', 'Consulting'),
        ('government', 'Government'),
        ('nonprofit', 'Non-Profit'),
        ('other', 'Other'),
    ]

    # Profile fields
    bio = models.TextField(blank=True, default='')
    industry = models.CharField(
        max_length=50,
        choices=INDUSTRY_CHOICES,
        blank=True,
        default=''
    )
    experience_level = models.CharField(
        max_length=20,
        choices=EXPERIENCE_LEVEL_CHOICES,
        blank=True,
        default=''
    )
    phone = models.CharField(max_length=20, blank=True, default='')
    location = models.CharField(max_length=200, blank=True, default='')
    linkedin_url = models.URLField(blank=True, default='')
    portfolio_url = models.URLField(blank=True, default='')

    # Preferences
    preferred_template = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email or self.username
