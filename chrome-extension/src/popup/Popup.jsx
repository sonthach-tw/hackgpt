import { useState } from 'react'
import './Popup.css'
function App() {
  const [crx, setCrx] = useState('leakshield')

  return (
    <main>
      <h3>Leak Shield</h3>

      <h6>v 0.0.0</h6>

      <form>
        <label>Mask character</label>
        <input id="prompt-textarea"/>
      </form>
    </main>
  )
}

export default App
