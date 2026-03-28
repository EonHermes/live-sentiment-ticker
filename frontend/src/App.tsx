import { useState, useEffect, useRef } from 'react'

interface SentimentData {
  tweet: string
  sentiment: 'positive' | 'negative' | 'neutral'
  scores: { positive: number; negative: number; neutral: number; compound: number }
  timestamp: string
}

function App() {
  const [sentiments, setSentiments] = useState<SentimentData[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/sentiment')
    wsRef.current = ws

    ws.onmessage = (event) => {
      const data: SentimentData = JSON.parse(event.data)
      setSentiments(prev => [data, ...prev].slice(0, 20))
    }

    return () => {
      ws.close()
    }
  }, [])

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return '#4ade80'
      case 'negative': return '#f87171'
      default: return '#9ca3af'
    }
  }

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      backgroundColor: '#1a1a2e', 
      minHeight: '100vh',
      color: '#eee'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Live Sentiment Ticker
      </h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {sentiments.map((item, idx) => (
          <div key={idx} style={{ 
            padding: '15px', 
            marginBottom: '10px', 
            borderLeft: `4px solid ${getSentimentColor(item.sentiment)}`,
            backgroundColor: '#16213e'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>{item.tweet}</p>
            <small style={{ color: getSentimentColor(item.sentiment), textTransform: 'uppercase' }}>
              {item.sentiment} (compound: {item.scores.compound.toFixed(2)})
            </small>
          </div>
        ))}
        
        {sentiments.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>Connecting to stream...</p>
        )}
      </div>
    </div>
  )
}

export default App
