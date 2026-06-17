import os
from django.core.management.base import BaseCommand
from django.conf import settings
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from rag.vector_store import get_vector_store

class Command(BaseCommand):
    help = 'Ingests Markdown knowledge base files into ChromaDB'

    def handle(self, *args, **kwargs):
        kb_dir = os.path.join(settings.BASE_DIR, 'rag', 'knowledge_base')
        if not os.path.exists(kb_dir):
            self.stdout.write(self.style.ERROR(f"Knowledge base directory not found at {kb_dir}"))
            return

        self.stdout.write(self.style.SUCCESS(f"Loading documents from {kb_dir}..."))
        
        # Load all markdown files recursively
        loader = DirectoryLoader(kb_dir, glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
        docs = loader.load()
        
        self.stdout.write(f"Loaded {len(docs)} documents.")
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        splits = text_splitter.split_documents(docs)
        
        self.stdout.write(f"Split into {len(splits)} chunks.")
        
        # Add metadata to chunks based on directory structure
        for chunk in splits:
            source = chunk.metadata.get('source', '')
            rel_path = os.path.relpath(source, kb_dir)
            chunk.metadata['category'] = os.path.dirname(rel_path) or 'general'
            
        self.stdout.write(self.style.SUCCESS("Ingesting into ChromaDB (this may take a minute)..."))
        
        # Get vector store and add documents
        vector_store = get_vector_store()
        vector_store.add_documents(documents=splits)
        
        self.stdout.write(self.style.SUCCESS(f"Successfully ingested {len(splits)} chunks into ChromaDB."))
