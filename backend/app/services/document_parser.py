import re
from typing import List, Dict
import fitz  # PyMuPDF
import docx  # python-docx

class DocumentParser:
    @staticmethod
    def parse_pdf(file_path: str, filename: str) -> List[Dict]:
        chunks = []
        doc = fitz.open(file_path)
        for page_num, page in enumerate(doc, start=1):
            text = page.get_text()
            parts = re.split(r'\n(?=[A-Z][A-Z ]+\n|\d+\.\s)', text)
            parts = [p.strip() for p in parts if p.strip()]
            for i, section_text in enumerate(parts):
                chunks.append({
                    "text": section_text,
                    "metadata": {
                        "filename": filename,
                        "page_number": page_num,
                        "section": f"section_{i}",
                        "chunk_id": f"{filename}_p{page_num}_s{i}"
                    }
                })
        return chunks

    @staticmethod
    def parse_docx(file_path: str, filename: str) -> List[Dict]:
        doc = docx.Document(file_path)
        full_text = "\n".join([para.text for para in doc.paragraphs])
        return [{
            "text": full_text,
            "metadata": {
                "filename": filename,
                "page_number": 1,
                "section": "full_doc",
                "chunk_id": f"{filename}_full"
            }
        }]

    @staticmethod
    def parse_txt(file_path: str, filename: str) -> List[Dict]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            full_text = f.read()
        return [{
            "text": full_text,
            "metadata": {
                "filename": filename,
                "page_number": 1,
                "section": "full_doc",
                "chunk_id": f"{filename}_full"
            }
        }]
