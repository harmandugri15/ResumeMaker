from django.contrib import admin
from .models import ResumeTemplate


@admin.register(ResumeTemplate)
class ResumeTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'accent_color', 'is_ats_friendly', 'is_active', 'display_order']
    list_filter = ['category', 'is_ats_friendly', 'is_active']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['display_order', 'is_active']
