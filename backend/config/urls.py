"""
URL configuration for Resume Maker project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/templates/', include('templates_engine.urls')),
    path('api/resumes/', include('resumes.urls')),
    path('api/ai/', include('ai_engine.urls')),
    path('api/review/', include('ai_engine.reviewer.urls')),
    path('api/tailor/', include('ai_engine.tailor.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
