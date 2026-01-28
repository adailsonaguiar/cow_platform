import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import DexxPluginModal from './PluginModal'

// Injetar estilos da modal no runtime para que `plugin.js` seja standalone
const __dexx_styles = `:root{--overlay-bg:rgba(0,0,0,0.7)}
body{font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial}

.dexx-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:var(--overlay-bg);display:flex;justify-content:center;align-items:center;z-index:999999}
.dexx-modal-content{background:white;border-radius:12px;padding:30px;max-width:500px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.3)}
.dexx-modal-title{margin:0 0 20px 0;font-size:24px;font-weight:600;color:#333}
.dexx-modal-question{margin:0 0 30px 0;font-size:16px;color:#666}
.dexx-modal-buttons{display:flex;gap:12px;justify-content:flex-end}
.dexx-modal-button{padding:12px 24px;border:none;border-radius:6px;font-size:16px;font-weight:500;cursor:pointer}
.dexx-modal-button-yes{background:#4CAF50;color:#fff}
.dexx-modal-button-no{background:#f44336;color:#fff}
.dexx-modal-prize-link{display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-size:18px;font-weight:600;margin-top:20px;width:100%;text-align:center}
.dexx-modal-dynamic-content{position:relative}
.dexx-modal-step-indicator{ text-align:center;font-size:12px;color:#999;margin-bottom:15px}
.dexx-modal-step-indicator .step-active{color:#4CAF50;font-weight:bold}
.dexx-modal-success-icon{text-align:center;font-size:48px;margin-bottom:20px}
.dexx-modal-answers-summary{background:#f5f5f5;padding:15px;border-radius:6px;margin-bottom:20px;font-size:14px;color:#666}
.dexx-modal-answers-summary strong{color:#333}
.dexx-modal-footer{text-align:center;font-size:12px;color:#999;margin-top:20px}
#dexx-rewarded-container.hidden{position:absolute;left:-9999px;opacity:0;pointer-events:none}
#dexx-rewarded-container{ text-align:center;margin-top:20px }

.app-root{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:40px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}
.demo-panel{background:white;padding:28px;border-radius:12px;max-width:800px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,0.15)}
.buttons{margin-top:16px}
button{cursor:pointer}
`;

function __injectStyles() {
  if (document.getElementById('dexx-plugin-styles')) return
  const s = document.createElement('style')
  s.id = 'dexx-plugin-styles'
  s.textContent = __dexx_styles
  document.head.appendChild(s)
}

let root = null
let container = null
const api = {
  openModal: () => {},
  closeModal: () => {},
  init: () => {}
}

function PluginApp() {
  const [open, setOpen] = useState(false)
  const inited = useRef(false)

  useEffect(() => {
    // expõe funções para o wrapper
    api.openModal = () => setOpen(true)
    api.closeModal = () => setOpen(false)
    api.init = () => { if (!inited.current) { inited.current = true } }
  }, [])

  return <DexxPluginModal open={open} onClose={() => setOpen(false)} />
}

function mount() {
  if (root) return
  __injectStyles()
  container = document.createElement('div')
  container.id = 'dexx-react-plugin-root'
  document.body.appendChild(container)
  root = createRoot(container)
  root.render(<PluginApp />)
}

// Garante stubs que o código de anúncios procura
function __ensureAdStubs() {
  if (!document.querySelector('ins[id*="job_rewarded_0"]')) {
    const ins = document.createElement('ins')
    ins.id = `gpt_unit_sim_${Date.now()}`
    // inicialmente escondido; será revelado quando necessário
    ins.style.display = 'none'
    ins.setAttribute('data-dexx-stub', '1')
    ins.style.setProperty('z-index', String(2147483646), 'important')
    document.body.appendChild(ins)
  }

  if (!document.getElementById('av-offerwall__wrapper')) {
    const w = document.createElement('div')
    w.id = 'av-offerwall__wrapper'
    w.style.display = 'none'
    document.body.appendChild(w)
  }
}

window.addEventListener('dexxPrizeClick', function () {
  __ensureAdStubs()
  setTimeout(() => {
    const offerwallPresent = !!document.getElementById('av-offerwall__wrapper') || !!document.getElementById('dexx-offerwall-overlay')
    const ins = document.querySelector('ins[data-dexx-stub]') || document.querySelector('ins[id*="job_rewarded_0"]')
    const insVisible = ins && window.getComputedStyle(ins).display !== 'none' && window.getComputedStyle(ins).visibility !== 'hidden' && (parseFloat(window.getComputedStyle(ins).opacity || '1') > 0)

    if (!offerwallPresent && !insVisible) {
      // fallback: revelar e abrir nossa simulação
      if (ins) {
        try {
          ins.style.setProperty('display', 'block', 'important')
          ins.style.setProperty('visibility', 'visible', 'important')
          ins.style.setProperty('opacity', '1', 'important')
          ins.style.setProperty('z-index', String(2147483646), 'important')
          if (!ins.innerHTML) ins.innerHTML = '<div style="width:1px;height:1px;">&nbsp;</div>'
        } catch (err) { ins.style.display = 'block' }
      }
    }
  }, 800)
})

function unmount() {
  if (!root) return
  try {
    root.unmount()
    container?.parentNode?.removeChild(container)
  } catch {}
  root = null
  container = null
}

api.openModal = () => {
  // 🔑 Verifica se já viu anúncio rewarded (hash na URL)
  if (window.location.hash.includes('goog_rewarded')) {
    console.log('🚫 Modal bloqueado: #goog_rewarded encontrado na URL')
    return
  }
  
  mount()
  setTimeout(() => {
    const ev = new CustomEvent('dexxPluginReady')
    window.dispatchEvent(ev)
  }, 0)
  /* actual opening handled inside PluginApp via api */
}
api.closeModal = unmount
api.init = () => {
  // 🔑 Verifica se já viu anúncio rewarded antes de inicializar
  if (window.location.hash.includes('goog_rewarded')) {
    console.log('🚫 Inicialização bloqueada: #goog_rewarded encontrado na URL')
    return
  }
  
  mount()
  /* abre automaticamente após 1s para replicar comportamento */
  setTimeout(() => api.openModal(), 1000)
}

window.DexxPlugin = api
// inicia automaticamente como plugin.js
api.init()

export default api