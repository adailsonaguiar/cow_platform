import React, { useEffect, useState } from 'react'
import PluginModal from './PluginModal'

export default function App() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="app-root">
      <div className="demo-panel">
        <h1>🚀 Dexx Plugin - React + Vite</h1>
        <p>Modal automática após 1s (comportamento similar a plugin.js).</p>
        <div className="buttons">
          <button onClick={() => setOpen(true)}>Abrir Modal</button>
        </div>
      </div>

      <PluginModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
