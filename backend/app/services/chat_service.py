from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains.history_aware_retriever import create_history_aware_retriever
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

from app.core.config import settings
from app.services.vector_store import VectorStoreManager

# Core Google Gemini LLM instance used for general operations and LangGraph agents
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.1,
    google_api_key=settings.GEMINI_API_KEY
)


def get_rag_chain(project_id: str):
    vs = VectorStoreManager()
    retriever = vs.retriever(project_id, k=5)

    # Standalone question generator from history + new question
    contextualize_q_prompt = ChatPromptTemplate.from_messages([
        ("system", "Given chat history and latest user question, formulate a standalone question."),
        ("human", "{input}"),
    ])
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

    # Core QA prompt injecting retrieved document contexts
    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Project Manager AI. Answer based ONLY on context. Cite sources as [Source: filename, Page X].\nContext:\n{context}"),
        ("human", "{input}"),
    ])
    
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    def get_memory(session_id: str):
        return RedisChatMessageHistory(session_id, url=settings.REDIS_URL)

    return RunnableWithMessageHistory(
        rag_chain, 
        get_memory,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )
