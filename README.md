# Live Sentiment Ticker

Real-time sentiment analysis dashboard that streams tweet sentiment data via WebSockets.

## Tech Stack

- **Backend:** FastAPI (Python) with NLTK/VADER for sentiment analysis
- **Frontend:** React + TypeScript + Vite
- **Communication:** WebSocket for real-time streaming

## Quick Start

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

Backend runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

- `GET /` - Health check and API info
- `GET /health` - Server health status with active connection count
- `WS /ws/sentiment` - WebSocket endpoint for real-time sentiment streaming

## WebSocket Message Format

```json
{
  "tweet": "Sample tweet text",
  "sentiment": "positive|negative|neutral",
  "scores": {
    "positive": 0.5,
    "negative": 0.1,
    "neutral": 0.4,
    "compound": 0.6
  },
  "timestamp": "2026-03-28T17:30:00.000Z"
}
```

## Development Notes

- Currently uses sample tweets for demonstration
- To integrate with real Twitter data, add your API credentials to `.env` and modify the backend to use tweepy
- VADER sentiment scores range from -1 (negative) to +1 (positive), compound score determines final label
