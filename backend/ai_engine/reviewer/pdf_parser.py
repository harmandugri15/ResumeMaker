"""
PDF Parsing using PyMuPDF (fitz).
Extracts text and structure from uploaded PDF resumes.
"""
import fitz # PyMuPDF

class PDFParser:
    @staticmethod
    def parse(pdf_path):
        """
        Extract text and basic structure from a PDF file.
        Returns a structured dictionary of the resume content.
        """
        try:
            doc = fitz.open(pdf_path)
            full_text = ""
            
            for page in doc:
                full_text += page.get_text("text") + "\n\n"
                
            # For a more advanced implementation, we would extract fonts,
            # sizes, and detect headings here using page.get_text("dict").
            # For this MVP, we return the raw text to pass to Gemini.
            
            doc.close()
            return {"raw_text": full_text}
            
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return None
