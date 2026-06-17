"""
URL patterns for resume CRUD.
"""
from django.urls import path
from . import views

app_name = 'resumes'

urlpatterns = [
    path('', views.ResumeListCreateView.as_view(), name='resume-list-create'),
    path('<str:resume_id>/', views.ResumeDetailView.as_view(), name='resume-detail'),
    path('<str:resume_id>/duplicate/', views.ResumeDuplicateView.as_view(), name='resume-duplicate'),
    path('<str:resume_id>/download/', views.ResumeDownloadView.as_view(), name='resume-download'),
]
