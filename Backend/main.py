from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    vectorizer = TfidfVectorizer(stop_words="english")
    X = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()
    scores = X.toarray()[0]

    # Pair words with scores
    word_scores = list(zip(feature_names, scores))
    word_scores.sort(key=lambda x: x[1], reverse=True)

    # Take top N words
    top_words = word_scores[:top_n]

    if not top_words:
        return []

    max_score = top_words[0][1]
    normalized = []
    for word, score in top_words:
        # Normalize relative to max, scaled 1–10
        weight = max(1.0, 10 * (score / max_score))
        normalized.append({"word": word, "weight": round(weight, 2)})
    return normalized


# API endpoint
@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    url = request.url
    text = fetch_text(url)
    if not text:
        return JSONResponse(content={"error": "Failed to fetch or parse the URL"}, status_code=400)

    keywords = extract_keywords(text)
    return JSONResponse(content=keywords)