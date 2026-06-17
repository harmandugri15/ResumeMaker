"""
URL patterns for Job Tailoring Engine.
"""
from django.urls import path
from . import views

app_name = 'tailor'

urlpatterns = [
    path('analyze-job/', views.AnalyzeJobView.as_view(), name='analyze-job'),
    path('compare/', views.CompareResumeView.as_view(), name='compare'),
    path('optimize/', views.OptimizeResumeView.as_view(), name='optimize'),
    path('parse-upload/', views.ParseUploadView.as_view(), name='parse-upload'),
]
