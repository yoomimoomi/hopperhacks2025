import { useState } from 'react'
import CameraFeed from './components/CameraFeed'
import EmotionDisplay from './components/EmotionDisplay'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Emotion Detection</h1>
      <CameraFeed />
      <EmotionDisplay />
    </>
  )
}

export default App

