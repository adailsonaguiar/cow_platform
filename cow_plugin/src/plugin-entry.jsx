import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import DexxPluginModal from './PluginModal'
// Importa os estilos - Vite vai injetar inline automaticamente no bundle
import stylesContent from './styles.css?inline'

// Injetar estilos da modal no runtime para que `plugin.js` seja standalone
const __dexx_styles = stylesContent

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
  mount()
  setTimeout(() => {
    const ev = new CustomEvent('dexxPluginReady')
    window.dispatchEvent(ev)
  }, 0)
  /* actual opening handled inside PluginApp via api */
}
api.closeModal = unmount
api.init = () => { 
  mount();
   /* abre automaticamente após 1s para replicar comportamento */ 
   setTimeout(() => api.openModal(), 1000) }

window.DexxPlugin = api
// inicia automaticamente como plugin.js
api.init()

export default api