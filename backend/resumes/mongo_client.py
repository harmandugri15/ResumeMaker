"""
MongoDB client for resume document storage.
Uses pymongo directly instead of Django ORM since resumes are document-shaped.
"""
from pymongo import MongoClient
from django.conf import settings


_client = None
_db = None


def get_db():
    """Get the MongoDB database instance (singleton)."""
    global _client, _db
    if _db is None:
        _client = MongoClient(settings.MONGODB_URI)
        _db = _client[settings.MONGODB_NAME]
    return _db


def get_resumes_collection():
    """Get the resumes collection."""
    return get_db()['resumes']


def get_interview_sessions_collection():
    """Get the interview sessions collection."""
    return get_db()['interview_sessions']
