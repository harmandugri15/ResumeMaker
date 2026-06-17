"""
RAG Retrieval Chain logic.
"""
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI
from django.conf import settings
from .vector_store import get_vector_store


def get_rag_context(query, k=3):
    """
    Retrieve relevant context from the vector store based on a query.
    This is a helper function to just get the text context without running a full LLM chain,
    which is useful when we want to inject it into our own specific prompts.
    """
    vector_store = get_vector_store()
    retriever = vector_store.as_retriever(search_kwargs={"k": k})
    
    docs = retriever.invoke(query)
    
    context = "\n\n".join([f"[{doc.metadata.get('source', 'Unknown')}] {doc.page_content}" for doc in docs])
    return context


def ask_knowledge_base(query):
    """
    Run a full RAG chain: retrieve context and generate an answer using Gemini.
    (Useful for debugging or a general chat feature)
    """
    if not settings.GEMINI_API_KEY:
         return "Error: Gemini API key is not configured."
         
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.3,
        google_api_key=settings.GEMINI_API_KEY
    )
    
    vector_store = get_vector_store()
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    
    prompt_template = """
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer based on the context, just say that you don't know, don't try to make up an answer.
    
    Context:
    {context}
    
    Question: {question}
    
    Answer:
    """
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )
    
    result = qa_chain.invoke({"query": query})
    return {
        "answer": result["result"],
        "sources": [doc.metadata.get("source") for doc in result["source_documents"]]
    }
