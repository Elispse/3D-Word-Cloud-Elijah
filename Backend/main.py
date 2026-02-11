from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app instance
app = FastAPI()

# Allow cross-origin requests so frontend can access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (change in production!)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Request body structure
class AnalyzeRequest(BaseModel):
    url: str  # Expect a single field 'url' from the frontend

# Fetch the raw text content from a webpage
def fetch_text(url: str) -> str:
    try:
        # Make GET request to the URL
        res = requests.get(url, timeout=5)
        res.raise_for_status()  # Raise exception for HTTP errors
    except Exception as e:
        print("Error fetching URL:", e)
        return ""  # Return empty string if fetch fails

    # Parse HTML and extract paragraph text
    soup = BeautifulSoup(res.text, "html.parser")
    paragraphs = soup.find_all("p")
    text = " ".join([p.get_text() for p in paragraphs])

    # Remove extra whitespace
    text = " ".join(text.split())
    return text

# Extract top keywords using TF-IDF
def extract_keywords(text: str, top_n: int = 50):
    vectorizer = TfidfVectorizer(stop_words="english")  # Ignore common English words
    X = vectorizer.fit_transform([text])  # Fit TF-IDF model
    feature_names = vectorizer.get_feature_names_out()  # Words
    scores = X.toarray()[0]  # Corresponding TF-IDF scores

    # Pair words with their scores and sort descending
    word_scores = list(zip(feature_names, scores))
    word_scores.sort(key=lambda x: x[1], reverse=True)

    # Take top N words
    top_words = word_scores[:top_n]

    if not top_words:
        return []

    # Normalize weights to scale 1–10 for frontend sizing
    max_score = top_words[0][1]
    normalized = []
    for word, score in top_words:
        weight = max(1.0, 10 * (score / max_score))
        normalized.append({"word": word, "weight": round(weight, 2)})
    return normalized

# API endpoint: receive URL and return keywords with weights
@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    url = request.url

    # Fetch the page text
    text = fetch_text(url)
    if not text:
        return JSONResponse(content={"error": "Failed to fetch or parse the URL"}, status_code=400)

    # Extract keywords
    keywords = extract_keywords(text)

    # Return JSON response to frontend
    return JSONResponse(content=keywords)
