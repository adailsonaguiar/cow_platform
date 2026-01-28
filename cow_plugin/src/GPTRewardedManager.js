/**
 * GPTRewardedManager - Gerencia integração com Google Publisher Tags (GPT)
 * para anúncios rewarded. Baseado em jobsmind.js e plugin-funcional.js
 */

class GPTRewardedManager {
  constructor() {
    this.rewardedLifecycle = 'unready'
    this.rewardedEvent = null
    this.rewardGranted = false
    this.fallbackTimer = null
    this.offerwallSeen = false
    this.mutationObserver = null
    this.initialized = false
    this.closedOnce = false
  }

  /**
   * Inicializa os listeners GPT (igual plugin-funcional.js linha ~450)
   * Deve ser chamado assim que o modal abre
   */
  init(onClose) {
    if (this.initialized) {
      console.log('⚠️ GPTRewardedManager já inicializado')
      return
    }

    this.onClose = onClose
    this.attachGPTListeners(0)
    console.log('🎬 GPT Listeners registrados')
    this.initialized = true
  }

  /**
   * Registra listeners para eventos do Google Publisher Tags
   * Baseado em jobsmind.js linha ~1565 e plugin-funcional.js linha ~450
   */
  attachGPTListeners(attempt) {
    attempt = attempt || 0
    const ready = !!(window.googletag && googletag.apiReady && googletag.pubads)
    
    if (!ready) {
      if (attempt > 200) {
        console.error('❌ GPT não ficou disponível após 200 tentativas')
        return
      }
      return setTimeout(() => this.attachGPTListeners(attempt + 1), 100)
    }
    
    try {
      const pubads = googletag.pubads()
      
      // 🔑 CRÍTICO: Captura quando anúncio rewarded está PRONTO
      // (igual jobsmind.js linha ~1565)
      pubads.addEventListener('rewardedSlotReady', (event) => {
        console.log('✅ rewardedSlotReady - Anúncio PRONTO para exibição!', event)
        this.rewardedEvent = event  // ← Armazena o evento
        this.rewardedLifecycle = 'ready'  // ← Marca como pronto
        
        // Cancela fallback se existir
        if (this.fallbackTimer) {
          clearTimeout(this.fallbackTimer)
          this.fallbackTimer = null
          console.log('⏰ Fallback cancelado - anúncio está pronto')
        }
      })
      
      // 🎁 Captura quando usuário GANHA a recompensa (assistiu completamente)
      // (igual jobsmind.js linha ~1573)
      pubads.addEventListener('rewardedSlotGranted', (event) => {
        console.log('🎁 rewardedSlotGranted - Recompensa CONCEDIDA!', event)
        this.rewardedLifecycle = 'granted'
        this.rewardGranted = true
      })
      
      // ❌ Captura quando anúncio é FECHADO
      // (igual jobsmind.js linha ~1577)
      pubads.addEventListener('rewardedSlotClosed', (event) => {
        console.log('❌ rewardedSlotClosed - Anúncio fechado')
        
        if (this.rewardedLifecycle === 'granted') {
          console.log('✅ Usuário assistiu completamente e ganhou recompensa')
        } else {
          console.log('⚠️ Usuário fechou antes de completar')
        }
        
        this.stopWatchers()
        this.safeCloseOnce()
      })
      
      pubads.addEventListener('gameManualInterstitialSlotClosed', () => {
        console.log('📊 Anúncio intersticial fechado')
        this.stopWatchers()
        this.safeCloseOnce()
      })
      
      console.log('✅ GPT Listeners configurados (rewardedSlotReady, rewardedSlotGranted, rewardedSlotClosed)')
    } catch(e) {
      console.error('❌ Erro ao configurar GPT listeners:', e)
    }
  }

  /**
   * Exibe o anúncio rewarded quando o usuário clicar no botão "Pegar Prêmio"
   * Baseado em plugin-funcional.js linha ~402
   */
  showRewarded() {
    console.log('🎁 showRewarded chamado', {
      lifecycle: this.rewardedLifecycle,
      hasEvent: !!this.rewardedEvent
    })

    // Verifica se anúncio está pronto
    if (this.rewardedLifecycle === 'ready' && this.rewardedEvent) {
      try {
        console.log('🎬 Chamando makeRewardedVisible() - Exibindo anúncio!')
        console.log('📋 Evento:', this.rewardedEvent)
        
        // Verifica se o método existe
        if (typeof this.rewardedEvent.makeRewardedVisible !== 'function') {
          console.error('❌ makeRewardedVisible não é uma função!', this.rewardedEvent)
          this.safeCloseOnce()
          return
        }
        
        this.rewardedEvent.makeRewardedVisible() // ← COMANDO CRÍTICO (jobsmind.js linha ~1551)
        this.rewardedLifecycle = 'opened'
        this.offerwallSeen = true
        
        // 🔑 Adiciona #goog_rewarded na URL para impedir reabertura
        this.addRewardedHashToUrl()
        
        console.log('✅ makeRewardedVisible() executado com sucesso!')
        
        // Cancela fallback
        if (this.fallbackTimer) {
          clearTimeout(this.fallbackTimer)
          this.fallbackTimer = null
        }
        
        // Inicia watchers para detectar quando anúncio fecha
        this.startWatchers()
        
      } catch(error) {
        console.error('❌ Erro ao chamar makeRewardedVisible():', error)
        console.error('Stack:', error.stack)
        this.safeCloseOnce()
      }
      
    } else {
      // Anúncio não está pronto
      console.warn('⚠️ Anúncio rewarded não está pronto!')
      console.warn('   - Lifecycle:', this.rewardedLifecycle)
      console.warn('   - Evento existe:', !!this.rewardedEvent)
      
      // Configura fallback para fechar se anúncio não aparecer
      this.fallbackTimer = setTimeout(() => {
        if (this.rewardedLifecycle !== 'ready') {
          console.warn('⚠️ Timeout: anúncio não ficou pronto em 10s')
          this.safeCloseOnce()
        }
      }, 10000)
    }
  }

  /**
   * Inicia observadores para detectar quando anúncio é adicionado/removido
   * Baseado em plugin-funcional.js linha ~512
   */
  startWatchers() {
    console.log('👀 Iniciando watchers de anúncios...')
    
    try {
      this.mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes) {
            mutation.addedNodes.forEach((node) => {
              if (node.id === 'av-offerwall__wrapper' || 
                  (node.querySelector && node.querySelector('#av-offerwall__wrapper'))) {
                console.log('✅ Offerwall ADICIONADO detectado')
                this.offerwallSeen = true
                if (this.fallbackTimer) {
                  clearTimeout(this.fallbackTimer)
                  this.fallbackTimer = null
                }
              }
              
              if (node.tagName === 'IFRAME' || node.tagName === 'INS' ||
                  (node.querySelector && (node.querySelector('iframe[id*="google"]') || node.querySelector('ins[id*="gpt_unit"]')))) {
                console.log('✅ Elemento de anúncio Google detectado:', node.tagName, node.id)
                this.offerwallSeen = true
                if (this.fallbackTimer) {
                  clearTimeout(this.fallbackTimer)
                  this.fallbackTimer = null
                }
              }
            })
          }
          
          if (mutation.removedNodes) {
            mutation.removedNodes.forEach((node) => {
              if (node.id === 'av-offerwall__wrapper' || 
                  (node.querySelector && node.querySelector('#av-offerwall__wrapper'))) {
                console.log('🎯 Offerwall REMOVIDO detectado')
                if (this.offerwallSeen) {
                  this.stopWatchers()
                  this.safeCloseOnce()
                }
              }
            })
          }
        })
      })
      
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      })
      
      console.log('✅ MutationObserver iniciado')
    } catch(e) {
      console.error('❌ Erro ao iniciar watchers:', e)
    }
  }

  /**
   * Para os observadores
   */
  stopWatchers() {
    if (this.mutationObserver) {
      console.log('🛑 Parando watchers')
      this.mutationObserver.disconnect()
      this.mutationObserver = null
    }
  }

  /**
   * Fecha o modal uma única vez (previne fechamentos múltiplos)
   */
  safeCloseOnce() {
    if (this.closedOnce) return
    this.closedOnce = true
    
    console.log('🚪 Fechando modal')
    
    if (this.onClose) {
      this.onClose()
    }
  }

  /**
   * Limpa todos os recursos
   */
  cleanup() {
    console.log('🧹 Limpando GPTRewardedManager')
    this.stopWatchers()
    
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer)
      this.fallbackTimer = null
    }
    
    this.rewardedLifecycle = 'unready'
    this.rewardedEvent = null
    this.rewardGranted = false
    this.offerwallSeen = false
    this.initialized = false
    this.closedOnce = false
  }

  /**
   * Adiciona #goog_rewarded na URL quando anúncio é exibido
   */
  addRewardedHashToUrl() {
    try {
      if (!window.location.hash.includes('goog_rewarded')) {
        const newHash = window.location.hash ? `${window.location.hash}&goog_rewarded` : '#goog_rewarded'
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${newHash}`)
        console.log('🔗 Hash #goog_rewarded adicionado à URL')
      }
    } catch (e) {
      console.warn('⚠️ Não foi possível adicionar hash à URL:', e)
    }
  }

  /**
   * Verifica se o anúncio rewarded já foi exibido (hash presente na URL)
   */
  hasRewardedHash() {
    return window.location.hash.includes('goog_rewarded')
  }
}

// Exporta como singleton para manter estado consistente
const gptManager = new GPTRewardedManager()

export default gptManager
