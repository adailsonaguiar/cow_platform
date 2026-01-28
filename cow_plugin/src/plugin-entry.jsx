import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import DexxPluginModal from './PluginModal'

// Injetar estilos da modal no runtime para que `plugin.js` seja standalone
// Design System: Modern SaaS (8px grid, inspired by Vercel/Linear/Notion)
const __dexx_styles = `:root{--dexx-white:#fff;--dexx-gray-50:#fafafa;--dexx-gray-100:#f4f4f5;--dexx-gray-200:#e4e4e7;--dexx-gray-300:#d4d4d8;--dexx-gray-400:#a1a1aa;--dexx-gray-500:#71717a;--dexx-gray-600:#52525b;--dexx-gray-700:#3f3f46;--dexx-gray-800:#27272a;--dexx-gray-900:#18181b;--dexx-black:#09090b;--dexx-accent:#7c3aed;--dexx-accent-light:#a78bfa;--dexx-accent-dark:#5b21b6;--dexx-accent-bg:#f5f3ff;--dexx-success:#10b981;--dexx-success-bg:#ecfdf5;--dexx-space-1:4px;--dexx-space-2:8px;--dexx-space-3:12px;--dexx-space-4:16px;--dexx-space-5:20px;--dexx-space-6:24px;--dexx-space-8:32px;--dexx-space-10:40px;--dexx-space-12:48px;--dexx-font-sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--dexx-font-size-xs:12px;--dexx-font-size-sm:14px;--dexx-font-size-base:16px;--dexx-font-size-lg:18px;--dexx-font-size-xl:20px;--dexx-font-size-2xl:24px;--dexx-radius-sm:6px;--dexx-radius-md:8px;--dexx-radius-lg:12px;--dexx-radius-xl:16px;--dexx-radius-full:9999px;--dexx-shadow-sm:0 1px 2px 0 rgba(0,0,0,0.05);--dexx-shadow-md:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1);--dexx-shadow-lg:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1);--dexx-shadow-xl:0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1);--dexx-shadow-2xl:0 25px 50px -12px rgba(0,0,0,0.25);--dexx-overlay-bg:rgba(9,9,11,0.8);--dexx-transition-fast:150ms cubic-bezier(0.4,0,0.2,1);--dexx-transition-base:200ms cubic-bezier(0.4,0,0.2,1);--dexx-transition-slow:300ms cubic-bezier(0.4,0,0.2,1)}
body{font-family:var(--dexx-font-sans);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.dexx-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:var(--dexx-overlay-bg);backdrop-filter:blur(4px);display:flex;justify-content:center;align-items:center;z-index:999999;padding:var(--dexx-space-4)}
.dexx-modal-content-wrapper{width:100%;max-width:480px;animation:dexx-modal-enter .3s cubic-bezier(.16,1,.3,1)}
@keyframes dexx-modal-enter{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.dexx-modal-content{background:var(--dexx-white);border-radius:var(--dexx-radius-xl);box-shadow:var(--dexx-shadow-2xl);border:1px solid var(--dexx-gray-200);overflow:hidden}
.dexx-modal-dynamic-content{position:relative}
.dexx-form-container{padding:var(--dexx-space-8)}
.dexx-progress-header{margin-bottom:var(--dexx-space-8)}
.dexx-step-info{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--dexx-space-3)}
.dexx-step-label{font-size:var(--dexx-font-size-sm);font-weight:500;color:var(--dexx-gray-500);letter-spacing:-.01em}
.dexx-progress-bar{height:4px;background:var(--dexx-gray-100);border-radius:var(--dexx-radius-full);overflow:hidden}
.dexx-progress-fill{height:100%;background:linear-gradient(90deg,var(--dexx-accent) 0%,var(--dexx-accent-light) 100%);border-radius:var(--dexx-radius-full);transition:width var(--dexx-transition-slow)}
.dexx-question-content{margin-bottom:var(--dexx-space-8)}
.dexx-form-title{margin:0 0 var(--dexx-space-3) 0;font-size:var(--dexx-font-size-xl);font-weight:600;color:var(--dexx-gray-900);letter-spacing:-.025em;line-height:1.3}
.dexx-form-subtitle{margin:0;font-size:var(--dexx-font-size-base);color:var(--dexx-gray-500);line-height:1.5}
.dexx-form-question{margin:0;font-size:var(--dexx-font-size-base);color:var(--dexx-gray-600);line-height:1.6}
.dexx-options-grid{display:flex;flex-direction:column;gap:var(--dexx-space-3)}
.dexx-option-button{display:flex;align-items:center;justify-content:space-between;width:100%;padding:var(--dexx-space-4) var(--dexx-space-5);background:var(--dexx-white);border:1px solid var(--dexx-gray-200);border-radius:var(--dexx-radius-lg);font-size:var(--dexx-font-size-base);font-weight:500;color:var(--dexx-gray-700);cursor:pointer;transition:all var(--dexx-transition-fast);text-align:left}
.dexx-option-button:hover{background:var(--dexx-gray-50);border-color:var(--dexx-gray-300);transform:translateY(-1px)}
.dexx-option-button:active{transform:translateY(0);background:var(--dexx-gray-100)}
.dexx-option-button:focus{outline:none;border-color:var(--dexx-accent);box-shadow:0 0 0 3px var(--dexx-accent-bg)}
.dexx-option-text{flex:1}
.dexx-option-arrow{color:var(--dexx-gray-400);transition:transform var(--dexx-transition-fast),color var(--dexx-transition-fast)}
.dexx-option-button:hover .dexx-option-arrow{color:var(--dexx-accent);transform:translateX(2px)}
.dexx-success-state{text-align:center}
.dexx-success-icon-wrapper{display:flex;justify-content:center;margin-bottom:var(--dexx-space-6)}
.dexx-success-icon{width:64px;height:64px;background:var(--dexx-success-bg);border-radius:var(--dexx-radius-full);display:flex;align-items:center;justify-content:center;color:var(--dexx-success);animation:dexx-success-pop .4s cubic-bezier(.34,1.56,.64,1)}
@keyframes dexx-success-pop{0%{transform:scale(0);opacity:0}50%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
.dexx-answers-card{background:var(--dexx-gray-50);border:1px solid var(--dexx-gray-100);border-radius:var(--dexx-radius-lg);margin:var(--dexx-space-6) 0;overflow:hidden;text-align:left}
.dexx-answers-header{padding:var(--dexx-space-3) var(--dexx-space-4);border-bottom:1px solid var(--dexx-gray-100)}
.dexx-answers-label{font-size:var(--dexx-font-size-xs);font-weight:600;color:var(--dexx-gray-500);text-transform:uppercase;letter-spacing:.05em}
.dexx-answers-list{padding:var(--dexx-space-2)}
.dexx-answer-item{display:flex;justify-content:space-between;align-items:center;padding:var(--dexx-space-3);border-radius:var(--dexx-radius-sm)}
.dexx-answer-item:hover{background:var(--dexx-white)}
.dexx-answer-question{font-size:var(--dexx-font-size-sm);color:var(--dexx-gray-600)}
.dexx-answer-value{font-size:var(--dexx-font-size-sm);font-weight:600;color:var(--dexx-gray-900);background:var(--dexx-white);padding:var(--dexx-space-1) var(--dexx-space-3);border-radius:var(--dexx-radius-full);border:1px solid var(--dexx-gray-200)}
.dexx-reward-notice{display:flex;align-items:flex-start;gap:var(--dexx-space-4);padding:var(--dexx-space-4);background:var(--dexx-accent-bg);border:1px solid rgba(124,58,237,.2);border-radius:var(--dexx-radius-lg);text-align:left;margin-top:var(--dexx-space-6)}
.dexx-reward-icon{font-size:24px;line-height:1}
.dexx-reward-text{display:flex;flex-direction:column;gap:var(--dexx-space-1)}
.dexx-reward-title{font-size:var(--dexx-font-size-sm);font-weight:600;color:var(--dexx-accent-dark)}
.dexx-reward-description{font-size:var(--dexx-font-size-sm);color:var(--dexx-gray-600);line-height:1.4}
.dexx-form-footer{padding:var(--dexx-space-4) var(--dexx-space-8);background:var(--dexx-gray-50);border-top:1px solid var(--dexx-gray-100);text-align:center}
.dexx-footer-text{font-size:var(--dexx-font-size-xs);color:var(--dexx-gray-400)}
#dexx-rewarded-container{padding:0 var(--dexx-space-8) var(--dexx-space-8)}
#dexx-rewarded-container.hidden{position:absolute;left:-9999px;opacity:0;pointer-events:none}
.dexx-modal-prize-link{display:flex;align-items:center;justify-content:center;gap:var(--dexx-space-2);padding:var(--dexx-space-4) var(--dexx-space-6);background:linear-gradient(135deg,var(--dexx-accent) 0%,var(--dexx-accent-dark) 100%);color:var(--dexx-white);font-size:var(--dexx-font-size-base);font-weight:600;text-decoration:none;border-radius:var(--dexx-radius-lg);border:none;cursor:pointer;transition:all var(--dexx-transition-base);box-shadow:0 4px 14px 0 rgba(124,58,237,.4)}
.dexx-modal-prize-link:hover{transform:translateY(-2px);box-shadow:0 6px 20px 0 rgba(124,58,237,.5)}
.dexx-modal-prize-link:active{transform:translateY(0)}
.app-root{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:var(--dexx-space-10);background:linear-gradient(135deg,var(--dexx-gray-900) 0%,var(--dexx-black) 100%)}
.demo-panel{background:var(--dexx-white);padding:var(--dexx-space-8);border-radius:var(--dexx-radius-xl);max-width:800px;width:100%;box-shadow:var(--dexx-shadow-2xl)}
.demo-panel h1{margin:0 0 var(--dexx-space-2) 0;font-size:var(--dexx-font-size-2xl);font-weight:700;color:var(--dexx-gray-900);letter-spacing:-.025em}
.buttons{margin-top:var(--dexx-space-6)}
.buttons button{padding:var(--dexx-space-3) var(--dexx-space-5);background:var(--dexx-accent);color:var(--dexx-white);border:none;border-radius:var(--dexx-radius-md);font-size:var(--dexx-font-size-sm);font-weight:500;cursor:pointer;transition:all var(--dexx-transition-fast)}
.buttons button:hover{background:var(--dexx-accent-dark)}
button{cursor:pointer}
.dexx-spinwheel-container{padding:var(--dexx-space-6);display:flex;flex-direction:column;align-items:center}
.dexx-spinwheel-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--dexx-space-12) 0;gap:var(--dexx-space-4)}
.dexx-spinwheel-loading-spinner{width:40px;height:40px;border:3px solid var(--dexx-gray-100);border-top-color:var(--dexx-accent);border-radius:50%;animation:dexx-spin .8s linear infinite}
@keyframes dexx-spin{to{transform:rotate(360deg)}}
.dexx-spinwheel-loading-text{font-size:var(--dexx-font-size-sm);color:var(--dexx-gray-500);margin:0}
.dexx-spinwheel-header{text-align:center;margin-bottom:var(--dexx-space-6)}
.dexx-spinwheel-badge{display:inline-flex;align-items:center;gap:var(--dexx-space-2);padding:var(--dexx-space-1) var(--dexx-space-3);background:var(--dexx-accent-bg);border:1px solid rgba(124,58,237,.2);border-radius:var(--dexx-radius-full);margin-bottom:var(--dexx-space-4)}
.dexx-spinwheel-badge-icon{font-size:14px}
.dexx-spinwheel-badge-text{font-size:var(--dexx-font-size-xs);font-weight:600;color:var(--dexx-accent-dark);text-transform:uppercase;letter-spacing:.05em}
.dexx-spinwheel-title{margin:0 0 var(--dexx-space-2) 0;font-size:var(--dexx-font-size-xl);font-weight:600;color:var(--dexx-gray-900);letter-spacing:-.025em;line-height:1.3}
.dexx-spinwheel-subtitle{margin:0;font-size:var(--dexx-font-size-sm);color:var(--dexx-gray-500)}
.dexx-spinwheel-wheel-section{position:relative;display:flex;flex-direction:column;align-items:center}
.dexx-spinwheel-arrow-container{position:relative;height:36px;display:flex;align-items:flex-end;justify-content:center;z-index:10}
.dexx-spinwheel-arrow{width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-top:28px solid var(--dexx-accent);filter:drop-shadow(0 2px 4px rgba(124,58,237,.3))}
.dexx-spinwheel-wheel-wrapper{position:relative}
.dexx-spinwheel-wheel{position:relative;width:260px;height:260px;border-radius:50%;box-shadow:var(--dexx-shadow-lg),inset 0 0 0 4px var(--dexx-gray-100);transition:transform 6s cubic-bezier(.17,.67,.12,.99);overflow:hidden;border:4px solid var(--dexx-white);outline:2px solid var(--dexx-gray-200)}
@media(min-width:768px){.dexx-spinwheel-wheel{width:300px;height:300px}}
.dexx-spinwheel-svg{width:100%;height:100%}
.dexx-spinwheel-segment-text{font-size:3.2px;font-weight:600;fill:white;text-shadow:0 1px 2px rgba(0,0,0,.3)}
.dexx-spinwheel-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:48px;height:48px;border-radius:50%;background:var(--dexx-white);box-shadow:var(--dexx-shadow-md);display:flex;align-items:center;justify-content:center;border:3px solid var(--dexx-gray-200)}
.dexx-spinwheel-center-inner{width:36px;height:36px;border-radius:50%;background:var(--dexx-gray-50);display:flex;align-items:center;justify-content:center}
.dexx-spinwheel-center-icon,.dexx-spinwheel-center-spinning{font-size:18px}
.dexx-spinwheel-center-spinning{animation:dexx-pulse 1s ease-in-out infinite}
@keyframes dexx-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.dexx-spinwheel-winner{text-align:center;margin-top:var(--dexx-space-6);padding:var(--dexx-space-5);background:var(--dexx-success-bg);border:1px solid rgba(16,185,129,.2);border-radius:var(--dexx-radius-lg);animation:dexx-winner-pop .4s cubic-bezier(.34,1.56,.64,1)}
@keyframes dexx-winner-pop{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
.dexx-spinwheel-winner-icon{font-size:32px;margin-bottom:var(--dexx-space-2)}
.dexx-spinwheel-winner-label{font-size:var(--dexx-font-size-sm);color:var(--dexx-gray-600);margin:0 0 var(--dexx-space-1) 0}
.dexx-spinwheel-winner-prize{font-size:var(--dexx-font-size-lg);font-weight:700;color:var(--dexx-success);margin:0}
.dexx-spinwheel-button{display:inline-flex;align-items:center;justify-content:center;gap:var(--dexx-space-2);margin-top:var(--dexx-space-6);padding:var(--dexx-space-4) var(--dexx-space-8);background:linear-gradient(135deg,var(--dexx-accent) 0%,var(--dexx-accent-dark) 100%);color:var(--dexx-white);font-size:var(--dexx-font-size-base);font-weight:600;border:none;border-radius:var(--dexx-radius-lg);cursor:pointer;transition:all var(--dexx-transition-base);box-shadow:0 4px 14px 0 rgba(124,58,237,.4)}
.dexx-spinwheel-button:hover{transform:translateY(-2px);box-shadow:0 6px 20px 0 rgba(124,58,237,.5)}
.dexx-spinwheel-button:active{transform:translateY(0)}
.dexx-spinwheel-button-icon{font-size:18px}
.dexx-spinwheel-spinning-text{margin-top:var(--dexx-space-6);padding:var(--dexx-space-3) var(--dexx-space-5);background:var(--dexx-gray-50);border-radius:var(--dexx-radius-full);font-size:var(--dexx-font-size-sm);font-weight:500;color:var(--dexx-gray-500);animation:dexx-pulse 1s ease-in-out infinite}
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