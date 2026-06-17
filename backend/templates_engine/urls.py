"""
URL patterns for resume templates.
"""
from django.urls import path
from . import views

app_name = 'templates_engine'

urlpatterns = [
    path('', views.TemplateListView.as_view(), name='template-list'),
    path('<slug:slug>/', views.TemplateDetailView.as_view(), name='template-detail'),
    path('<slug:slug>/preview/', views.TemplatePreviewView.as_view(), name='template-preview'),
    path('<int:id>/render/', views.TemplateLiveRenderView.as_view(), name='template-live-render'),
]
