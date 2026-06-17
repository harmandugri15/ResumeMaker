"""
URL patterns for Resume Reviewer.
"""
from django.urls import path
from . import views

app_name = 'reviewer'

urlpatterns = [
    path('upload/', views.UploadReviewView.as_view(), name='upload-review'),
    path('analyze/', views.AnalyzeReviewView.as_view(), name='analyze-review'),
]
