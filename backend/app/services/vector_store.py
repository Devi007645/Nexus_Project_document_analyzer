from typing import List, Dict
from pinecone import Pinecone, ServerlessSpec
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from app.core.config import settings

class VectorStoreManager:
    def __init__(self):
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        
        # Determine the dimension of the Pinecone index dynamically
        dimension = 1536 # default fallback for OpenAI
        try:
            indexes = [idx.name for idx in self.pc.list_indexes()]
            if settings.PINECONE_INDEX_NAME in indexes:
                desc = self.pc.describe_index(settings.PINECONE_INDEX_NAME)
                dimension = desc.dimension
                print(f"[VectorStore] Using existing Pinecone index '{settings.PINECONE_INDEX_NAME}' with dimension {dimension}.")
            else:
                print(f"[VectorStore] Index '{settings.PINECONE_INDEX_NAME}' not found. It will be created.")
                self._ensure_index()
                desc = self.pc.describe_index(settings.PINECONE_INDEX_NAME)
                dimension = desc.dimension
        except Exception as e:
            print(f"[VectorStore] Warning: Failed to fetch index dimension from Pinecone: {e}. Defaulting to 1536.")
            
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=settings.OPENAI_API_KEY,
            dimensions=dimension
        )

    def _ensure_index(self):
        # Dynamically create index if it doesn't already exist using serverless spec
        try:
            indexes = [idx.name for idx in self.pc.list_indexes()]
            if settings.PINECONE_INDEX_NAME not in indexes:
                print(f"[VectorStore] Creating serverless Pinecone index '{settings.PINECONE_INDEX_NAME}'...")
                self.pc.create_index(
                    name=settings.PINECONE_INDEX_NAME,
                    dimension=1536, # Standard dimension for OpenAI
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region="us-east-1"
                    )
                )
                print(f"[VectorStore] Successfully created serverless index.")
        except Exception as e:
            print(f"[VectorStore] Error creating Pinecone index: {e}")


    def get_store(self, namespace: str) -> PineconeVectorStore:
        return PineconeVectorStore(
            index_name=settings.PINECONE_INDEX_NAME,
            embedding=self.embeddings,
            namespace=namespace
        )

    def index_documents(self, chunks: List[Dict], project_id: str):
        texts = [c["text"] for c in chunks]
        metadatas = [{**c["metadata"], "project_id": project_id} for c in chunks]
        vectorstore = self.get_store(namespace=project_id)
        vectorstore.add_texts(texts=texts, metadatas=metadatas)

    def retriever(self, project_id: str, k: int = 5):
        vectorstore = self.get_store(namespace=project_id)
        return vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": k, "filter": {"project_id": project_id}}
        )
