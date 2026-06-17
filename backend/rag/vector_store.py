"""
Vector store management using ChromaDB.
"""
import os
import chromadb
from django.conf import settings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma


from langchain_community.embeddings import HuggingFaceEmbeddings

def get_embeddings_model():
    """Get the local HuggingFace embeddings model."""
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


def get_vector_store(collection_name="resume_knowledge_base"):
    """Get or create the ChromaDB vector store."""
    embeddings = get_embeddings_model()
    
    # Ensure directory exists
    os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
    
    # Initialize Chroma client
    client = chromadb.PersistentClient(path=str(settings.CHROMA_PERSIST_DIR))
    
    # Langchain wrapper
    vector_store = Chroma(
        client=client,
        collection_name=collection_name,
        embedding_function=embeddings
    )
    
    return vector_store
