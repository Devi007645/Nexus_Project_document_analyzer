from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_classic.chains.history_aware_retriever import create_history_aware_retriever
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# In-memory store for session histories when Redis is disabled/offline
chat_histories = {}


from app.core.config import settings
from app.services.vector_store import VectorStoreManager

# Core OpenAI LLM instance used for general operations and LangGraph agents
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.1,
    api_key=settings.OPENAI_API_KEY
)


def get_rag_chain(project_id: str):
    vs = VectorStoreManager()
    retriever = vs.retriever(project_id, k=5)

    # Standalone question generator from history + new question
    contextualize_q_prompt = ChatPromptTemplate.from_messages([
        ("system", "Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is."),
        MessagesPlaceholder("chat_history"),
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
        redis_url = getattr(settings, "REDIS_URL", None)
        if redis_url:
            try:
                return RedisChatMessageHistory(session_id, url=redis_url)
            except Exception as e:
                print(f"Redis memory failed: {e}. Falling back to in-memory history.")
        
        if session_id not in chat_histories:
            chat_histories[session_id] = InMemoryChatMessageHistory()
        return chat_histories[session_id]

    return RunnableWithMessageHistory(
        rag_chain, 
        get_memory,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )
