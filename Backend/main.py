from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()

# Request body
class AnalyzeRequest(BaseModel):
    url: str

# Fetch text from URL
def fetch_text(url: str) -> str:
    try:
        res = requests.get(url, timeout=5)
        res.raise_for_status()
    except Exception as e:
        print("Error fetching URL:", e)
        return ""

    soup = BeautifulSoup(res.text, "html.parser")
    paragraphs = soup.find_all("p")
    text = " ".join([p.get_text() for p in paragraphs])
    # Basic cleaning: remove extra whitespace
    text = " ".join(text.split())
    return text

# Extract top keywords and normalize weights
def extract_keywords(text: str, top_n: int = 50):
    return

# API endpoint
@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    url = request.url
    text = fetch_text(url)
    if not text:
        return JSONResponse(content={"error": "Failed to fetch or parse the URL"}, status_code=400)

    keywords = extract_keywords(text)
    return JSONResponse(content=keywords)