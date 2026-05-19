from fastapi import APIRouter
from app.schemas import ChatRequest, ChatResponse
from app.services.chat_service import get_rag_chain
from app.core.config import settings

router = APIRouter(tags=["Chat"])

@router.post("/api/v1/chat", response_model=ChatResponse)
async def chat_with_project(req: ChatRequest):
    try:
        is_default_openai = settings.OPENAI_API_KEY == "your-openai-key" or not settings.OPENAI_API_KEY
        if is_default_openai:
            raise ValueError("OpenAI API key is using default placeholder")

        rag_chain = get_rag_chain(req.project_id)
        response = rag_chain.invoke(
            {"input": req.question},
            config={"configurable": {"session_id": req.session_id}}
        )
        return ChatResponse(answer=response["answer"], session_id=req.session_id)
    except Exception as e:
        print(f"Chat execution failed ({e}). Falling back to helpful offline message.")
        fallback_answer = (
            f"Offline Chat Mode:\n\n"
            f"I received your question: \"{req.question}\".\n\n"
            f"Currently, the live AI conversational assistant is offline because the OpenAI API Key or Redis connection is not configured in `backend/.env` (Connection info: {str(e)[:80]}).\n\n"
            f"Once you configure `OPENAI_API_KEY` and start Redis, I will be able to perform high-fidelity semantic searches and answer detailed questions citing exact pages and requirement blocks in your uploaded documentation."
        )
        return ChatResponse(answer=fallback_answer, session_id=req.session_id)
