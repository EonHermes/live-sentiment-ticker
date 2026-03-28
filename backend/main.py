import asyncio
from datetime import datetime
from typing import List

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

load_dotenv()
nltk.download('vader_lexicon', quiet=True)

app = FastAPI(title="Live Sentiment Ticker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sia = SentimentIntensityAnalyzer()
connections: List[WebSocket] = []

SAMPLE_TWEETS = [
    "Just had the best coffee of my life!",
    "This is absolutely terrible.",
    "Amazing progress on the project today!",
    "Feeling really frustrated with this bug.",
    "Love the new features in this update!",
]

async def generate_sentiment_data():
    while True:
        tweet = SAMPLE_TWEETS[hash(str(datetime.now())) % len(SAMPLE_TWEETS)]
        scores = sia.polarity_scores(tweet)
        sentiment = 'positive' if scores['compound'] >= 0.05 else 'negative' if scores['compound'] <= -0.05 else 'neutral'
        
        yield {
            "tweet": tweet,
            "sentiment": sentiment,
            "scores": scores,
            "timestamp": datetime.now().isoformat()
        }
        await asyncio.sleep(2)

@app.get("/")
async def root():
    return {"message": "Live Sentiment Ticker API", "status": "running"}

@app.websocket("/ws/sentiment")
async def websocket_sentiment(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        async for data in generate_sentiment_data():
            await websocket.send_json(data)
    except Exception:
        if websocket in connections:
            connections.remove(websocket)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "active_connections": len(connections)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
