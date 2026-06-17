"""
URL patterns for AI Engine.
"""
from django.urls import path
from . import views

app_name = 'ai_engine'

urlpatterns = [
    path('generate-bullets/', views.GenerateBulletsView.as_view(), name='generate-bullets'),
    path('generate-summary/', views.GenerateSummaryView.as_view(), name='generate-summary'),
    path('categorize-skills/', views.CategorizeSkillsView.as_view(), name='categorize-skills'),
    path('interview-chat/', views.InterviewChatView.as_view(), name='interview-chat'),
]
