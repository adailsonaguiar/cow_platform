(function() {
  'use strict';

  if (window.DexxPlugin) {
    console.warn('Dexx Plugin já foi inicializado');
    return;
  }

  const DexxPlugin = {
    initialized: false,
    modalElement: null,
    currentStep: 1,
    answers: {},
    offerwallSeen: false,
    pollId: null,
    mutationObserver: null,
    pollTimeout: null,
    fallbackTimer: null,
    closedOnce: false,
    
    // Variáveis para anúncio rewarded (seguindo jobsmind.js)
    rewardedEvent: null,
    rewardedLifecycle: null,
    rewardGranted: false,

    questions: [
      {
        title: 'Pergunta 1',
        question: 'Você está gostando da sua experiência neste site?'
      },
      {
        title: 'Pergunta 2',
        question: 'Você recomendaria este site para seus amigos?'
      }
    ],

    styles: `
      .dexx-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }

      .dexx-modal-content {
        background-color: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: dexx-modal-fadein 0.3s ease-out;
      }

      @keyframes dexx-modal-fadein {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .dexx-modal-title {
        margin: 0 0 20px 0;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }

      .dexx-modal-question {
        margin: 0 0 30px 0;
        font-size: 16px;
        color: #666;
        line-height: 1.5;
      }

      .dexx-modal-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .dexx-modal-button {
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .dexx-modal-button-yes {
        background-color: #4CAF50;
        color: white;
      }

      .dexx-modal-button-yes:hover {
        background-color: #45a049;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
      }

      .dexx-modal-button-no {
        background-color: #f44336;
        color: white;
      }

      .dexx-modal-button-no:hover {
        background-color: #da190b;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
      }

      .dexx-modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 28px;
        color: #999;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 30px;
        height: 30px;
      }

      .dexx-modal-close:hover {
        color: #333;
      }

      .dexx-modal-content-wrapper {
        position: relative;
      }

      .dexx-modal-prize-link {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 32px;
        border-radius: 8px;
        text-decoration: none;
        font-size: 18px;
        font-weight: 600;
        transition: all 0.3s ease;
        text-align: center;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        margin-top: 20px;
        width: 100%;
        cursor: pointer;
      }

      .dexx-modal-prize-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      .dexx-modal-step-indicator {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-bottom: 15px;
      }

      .dexx-modal-step-indicator .step-active {
        color: #4CAF50;
        font-weight: bold;
      }

      .dexx-modal-success-icon {
        text-align: center;
        font-size: 48px;
        margin-bottom: 20px;
      }

      .dexx-modal-answers-summary {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-size: 14px;
        color: #666;
      }

      .dexx-modal-answers-summary strong {
        color: #333;
      }

      .dexx-modal-options {
        text-align: center;
      }

      .dexx-modal-footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-top: 20px;
      }

      #dexx-rewarded-container {
        text-align: center;
        margin-top: 20px;
      }
      
      #dexx-rewarded-container.hidden {
        position: absolute;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
      }
    `,

    injectStyles: function() {
      const styleElement = document.createElement('style');
      styleElement.textContent = this.styles;
      document.head.appendChild(styleElement);
    },

    getModalContent: function() {
      if (this.currentStep <= this.questions.length) {
        const question = this.questions[this.currentStep - 1];
        return `
          <div class="dexx-modal-step-indicator">
            Etapa <span class="step-active">${this.currentStep}</span> de ${this.questions.length}
          </div>
          <h2 class="dexx-modal-title">${question.title}</h2>
          <p class="dexx-modal-question">${question.question}</p>
          <div class="dexx-modal-buttons">
            <button class="dexx-modal-button dexx-modal-button-no" data-answer="não">Não</button>
            <button class="dexx-modal-button dexx-modal-button-yes" data-answer="sim">Sim</button>
          </div>
        `;
      } else {
        return `
          <div class="dexx-modal-success-icon">🎉</div>
          <h2 class="dexx-modal-title">Obrigado por participar!</h2>
          <div class="dexx-modal-answers-summary">
            <p><strong>Pergunta 1:</strong> ${this.answers.step1}</p>
            <p><strong>Pergunta 2:</strong> ${this.answers.step2}</p>
          </div>
          <p class="dexx-modal-question">
            Como agradecimento, preparamos um prêmio especial para você!
          </p>
          <div class="dexx-modal-footer">Veja a recomendação patrocinada para continuar</div>
        `;
      }
    },

    // MUDANÇA PRINCIPAL: Link criado desde o início
    createModal: function() {
      const overlay = document.createElement('div');
      overlay.className = 'dexx-modal-overlay';
      overlay.innerHTML = `
        <div class="dexx-modal-content-wrapper">
          <div class="dexx-modal-content">
            <button class="dexx-modal-close" aria-label="Fechar">&times;</button>
            
            <!-- Link recompensado VISÍVEL desde o início mas fora da tela para ActView processar -->
            <div id="dexx-rewarded-container" class="hidden">
              <a href="#"
                 class="dexx-modal-prize-link av-rewarded" 
                 data-av-rewarded="true" 
                 data-google-rewarded="true" 
                 data-google-interstitial="false"
                 role="button" 
                 tabindex="-1">
                🎁 Pegar Prêmio
              </a>
            </div>
            
            <div class="dexx-modal-dynamic-content">
              ${this.getModalContent()}
            </div>
          </div>
        </div>
      `;

      return overlay;
    },

    updateModalContent: function() {
      const contentArea = this.modalElement.querySelector('.dexx-modal-dynamic-content');
      if (contentArea) {
        contentArea.innerHTML = this.getModalContent();
        this.attachButtonEvents();
        
        // Revela o link quando chega na tela final
        if (this.currentStep > this.questions.length) {
          this.showRewardedLink();
        }
      }
    },

    // NOVA FUNÇÃO: Apenas revela o link que já existe
    showRewardedLink: function() {
      console.log('🎬 Revelando link de prêmio...');
      
      const container = this.modalElement.querySelector('#dexx-rewarded-container');
      const prizeLink = this.modalElement.querySelector('.dexx-modal-prize-link');
      
      if (container && prizeLink) {
        // Move para dentro do content area (depois do texto)
        const contentArea = this.modalElement.querySelector('.dexx-modal-dynamic-content');
        if (contentArea) {
          contentArea.appendChild(container);
        }
        
        // Remove classe 'hidden' para trazer o link de volta à tela
        container.classList.remove('hidden');
        
        // Permite foco no link
        prizeLink.setAttribute('tabindex', '0');
        
        console.log('✅ Link revelado:', prizeLink);
        console.log('🔗 Href:', prizeLink.href);
        console.log('📋 Atributos:', {
          'class': prizeLink.className,
          'data-av-rewarded': prizeLink.getAttribute('data-av-rewarded'),
          'data-google-rewarded': prizeLink.getAttribute('data-google-rewarded'),
          'data-google-interstitial': prizeLink.getAttribute('data-google-interstitial'),
          'data-av-onclick': prizeLink.getAttribute('data-av-onclick'),
          'onclick': prizeLink.getAttribute('onclick')
        });
        
        // Aguarda ActView processar o link (agora que está visível)
        setTimeout(() => {
          console.log('🔍 Verificando processamento ActView...');
          console.log('🔗 Href atualizado:', prizeLink.href);
          console.log('📊 Lifecycle:', this.rewardedLifecycle);
          console.log('🎬 Evento capturado:', !!this.rewardedEvent);
          
          // Verifica se o elemento <ins> foi criado
          const insElement = document.querySelector('ins[id*="gpt_unit"]');
          if (insElement) {
            console.log('✅ Elemento <ins> encontrado:', insElement.id);
            console.log('👁️ Display:', window.getComputedStyle(insElement).display);
          } else {
            console.warn('⚠️ Elemento <ins> não encontrado');
          }
        }, 500);
        
        // Anexa nossos listeners
        this.attachPrizeLinkEvents();
      }
    },

    attachButtonEvents: function() {
      const buttons = this.modalElement.querySelectorAll('.dexx-modal-button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const answer = button.getAttribute('data-answer');
          this.handleResponse(answer);
        });
      });
    },

    attachPrizeLinkEvents: function() {
      const prizeLink = this.modalElement.querySelector('.dexx-modal-prize-link');
      if (prizeLink && !prizeLink.__dexxBound) {
        // 🔑 CRÍTICO: Use capture:true e stopPropagation para garantir que nosso handler execute primeiro
        prizeLink.addEventListener('click', (e) => {
          console.log('🎁 Link "Pegar Prêmio" clicado!');
          console.log('🔗 URL:', e.target.href);
          console.log('📊 Lifecycle atual:', this.rewardedLifecycle);
          console.log('🎬 Evento armazenado:', !!this.rewardedEvent);
          
          // SEMPRE previne navegação primeiro
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          try {
            localStorage.setItem('dexx_prize_clicked', String(Date.now()));
            localStorage.setItem('dexx_once', '1');
          } catch(_) {}
          
          const event = new CustomEvent('dexxPrizeClick', {
            detail: { 
              answers: this.answers,
              timestamp: new Date().toISOString()
            }
          });
          window.dispatchEvent(event);
          
          // 🔑 CRÍTICO: Verifica se anúncio está pronto e chama makeRewardedVisible()
          // (igual jobsmind.js linha ~1500)
          if (this.rewardedLifecycle === 'ready' && this.rewardedEvent) {
            
            try {
              console.log('🎬 Chamando makeRewardedVisible() - Exibindo anúncio!');
              this.rewardedEvent.makeRewardedVisible(); // ← COMANDO CRÍTICO
              this.rewardedLifecycle = 'opened';
              this.offerwallSeen = true;
              
              // Cancela fallback
              if (this.fallbackTimer) {
                clearTimeout(this.fallbackTimer);
                this.fallbackTimer = null;
              }
              
            } catch(error) {
              console.error('❌ Erro ao chamar makeRewardedVisible():', error);
              this.safeCloseOnce();
            }
            
          } else {
            // Anúncio não está pronto
            console.warn('⚠️ Anúncio rewarded não está pronto!');
            console.warn('   - Lifecycle:', this.rewardedLifecycle);
            console.warn('   - Evento existe:', !!this.rewardedEvent);
            
            // Configura fallback para fechar se anúncio não aparecer
            this.fallbackTimer = setTimeout(() => {
              if (this.rewardedLifecycle !== 'ready') {
                console.warn('⚠️ Timeout: anúncio não ficou pronto em 10s');
                this.safeCloseOnce();
              }
            }, 10000);
          }
          
          this.startWatchers();
          
          return false; // Extra segurança para prevenir navegação
        }, { capture: true, passive: false }); // capture:true = executa ANTES de outros handlers
        prizeLink.__dexxBound = true;
        
        // Remove qualquer onclick inline que possa estar causando conflito
        prizeLink.removeAttribute('onclick');
      }
    },

    safeCloseOnce: function() {
      if (this.closedOnce) return;
      this.closedOnce = true;
      this.closeModal();
    },

    attachGPTListeners: function(attempt) {
      attempt = attempt || 0;
      const ready = !!(window.googletag && googletag.apiReady && googletag.pubads);
      
      if (!ready) {
        if (attempt > 200) return;
        return setTimeout(() => this.attachGPTListeners(attempt + 1), 100);
      }
      
      try {
        const pubads = googletag.pubads();
        
        // 🔑 CRÍTICO: Captura quando anúncio rewarded está PRONTO (igual jobsmind.js linha ~920)
        pubads.addEventListener('rewardedSlotReady', (event) => {
          console.log('✅ rewardedSlotReady - Anúncio PRONTO para exibição!', event);
          this.rewardedEvent = event;  // ← Armazena o evento
          this.rewardedLifecycle = 'ready';  // ← Marca como pronto
          
          // Cancela fallback se existir
          if (this.fallbackTimer) {
            clearTimeout(this.fallbackTimer);
            this.fallbackTimer = null;
            console.log('⏰ Fallback cancelado - anúncio está pronto');
          }
        });
        
        // 🎁 Captura quando usuário GANHA a recompensa (assistiu completamente)
        pubads.addEventListener('rewardedSlotGranted', (event) => {
          console.log('🎁 rewardedSlotGranted - Recompensa CONCEDIDA!', event);
          this.rewardedLifecycle = 'granted';
          this.rewardGranted = true;
        });
        
        // ❌ Captura quando anúncio é FECHADO
        pubads.addEventListener('rewardedSlotClosed', (event) => {
          console.log('❌ rewardedSlotClosed - Anúncio fechado');
          
          if (this.rewardedLifecycle === 'granted') {
            console.log('✅ Usuário assistiu completamente e ganhou recompensa');
          } else {
            console.log('⚠️ Usuário fechou antes de completar');
          }
          
          this.stopWatchers();
          this.safeCloseOnce();
        });
        
        pubads.addEventListener('gameManualInterstitialSlotClosed', () => {
          console.log('📊 Anúncio intersticial fechado');
          this.stopWatchers();
          this.safeCloseOnce();
        });
        
        console.log('✅ GPT Listeners configurados (rewardedSlotReady, rewardedSlotGranted, rewardedSlotClosed)');
      } catch(e) {
        console.error('❌ Erro ao configurar GPT listeners:', e);
      }
    },

    startWatchers: function() {
      console.log('👀 Iniciando watchers de anúncios...');
      
      try {
        this.mutationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
              mutation.addedNodes.forEach((node) => {
                if (node.id === 'av-offerwall__wrapper' || 
                    (node.querySelector && node.querySelector('#av-offerwall__wrapper'))) {
                  console.log('✅ Offerwall ADICIONADO detectado');
                  this.offerwallSeen = true;
                  if (this.fallbackTimer) {
                    clearTimeout(this.fallbackTimer);
                    this.fallbackTimer = null;
                  }
                }
                
                if (node.tagName === 'IFRAME' || node.tagName === 'INS' ||
                    (node.querySelector && (node.querySelector('iframe[id*="google"]') || node.querySelector('ins[id*="gpt_unit"]')))) {
                  console.log('✅ Elemento de anúncio Google detectado:', node.tagName, node.id);
                  this.offerwallSeen = true;
                  if (this.fallbackTimer) {
                    clearTimeout(this.fallbackTimer);
                    this.fallbackTimer = null;
                  }
                }
              });
            }
            
            if (mutation.removedNodes) {
              mutation.removedNodes.forEach((node) => {
                if (node.id === 'av-offerwall__wrapper' || 
                    (node.querySelector && node.querySelector('#av-offerwall__wrapper'))) {
                  console.log('🎯 Offerwall REMOVIDO detectado');
                  if (this.offerwallSeen) {
                    this.stopWatchers();
                    this.safeCloseOnce();
                  }
                }
              });
            }
          });
        });
        
        this.mutationObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      } catch(e) {
        console.error('❌ Erro ao criar MutationObserver:', e);
      }
      
      this.pollId = setInterval(() => {
        const offerwallElement = document.getElementById('av-offerwall__wrapper');
        const googleIns = document.querySelector('ins[id*="gpt_unit"]');
        
        if (offerwallElement || googleIns) {
          if (!this.offerwallSeen) {
            console.log('✅ Anúncio detectado via polling');
          }
          this.offerwallSeen = true;
          if (this.fallbackTimer) {
            clearTimeout(this.fallbackTimer);
            this.fallbackTimer = null;
          }
        }
        
        if (this.offerwallSeen && !offerwallElement && !googleIns) {
          console.log('✅ Anúncio fechado - encerrando modal');
          this.stopWatchers();
          this.safeCloseOnce();
        }
        
        if (document.cookie.indexOf('avOfferWallRewarded=true') !== -1 ||
            document.cookie.indexOf('avInterstitialViewed=true') !== -1) {
          console.log('✅ Cookie de recompensa detectado');
          this.stopWatchers();
          this.safeCloseOnce();
        }
      }, 300);
      
      this.pollTimeout = setTimeout(() => {
        console.warn('⏱️ Timeout de watchers atingido (90s)');
        this.stopWatchers();
      }, 90000);
      
      // Nota: attachGPTListeners() já foi chamado em openModal()
      // Não precisa chamar aqui novamente
    },

    stopWatchers: function() {
      console.log('🛑 Parando watchers...');
      
      if (this.pollId) {
        clearInterval(this.pollId);
        this.pollId = null;
      }
      
      if (this.pollTimeout) {
        clearTimeout(this.pollTimeout);
        this.pollTimeout = null;
      }
      
      if (this.mutationObserver) {
        try {
          this.mutationObserver.disconnect();
        } catch(e) {}
        this.mutationObserver = null;
      }
      
      if (this.fallbackTimer) {
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }
    },

    attachEvents: function() {
      const closeButton = this.modalElement.querySelector('.dexx-modal-close');
      closeButton.addEventListener('click', () => this.closeModal());

      this.modalElement.addEventListener('click', (e) => {
        if (e.target === this.modalElement) {
          this.closeModal();
        }
      });

      const handleEscape = (e) => {
        if (e.key === 'Escape' && this.modalElement) {
          this.closeModal();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

      this.attachButtonEvents();
    },

    handleResponse: function(response) {
      console.log(`Resposta - Step ${this.currentStep}:`, response);
      
      this.answers[`step${this.currentStep}`] = response;

      const event = new CustomEvent('dexxPluginResponse', {
        detail: { 
          step: this.currentStep,
          response: response,
          allAnswers: this.answers
        }
      });
      window.dispatchEvent(event);

      if (this.currentStep < this.questions.length) {
        this.currentStep++;
        this.updateModalContent();
      } else {
        this.currentStep++;
        this.updateModalContent();
      }
    },

    closeModal: function() {
      if (this.modalElement) {
        this.stopWatchers();
        
        if (this.modalElement.parentNode) {
          this.modalElement.parentNode.removeChild(this.modalElement);
        }
        this.modalElement = null;
        this.currentStep = 1;
        this.answers = {};
        this.closedOnce = false;
        this.offerwallSeen = false;
      }
    },

    openModal: function() {
      if (this.modalElement) {
        console.warn('Modal já está aberto');
        return;
      }

      this.currentStep = 1;
      this.answers = {};
      this.modalElement = this.createModal();
      document.body.appendChild(this.modalElement);
      this.attachEvents();
      
      // 🔑 CRÍTICO: Registra listeners GPT IMEDIATAMENTE (igual jobsmind.js)
      // Os listeners precisam estar prontos ANTES do rewardedSlotReady disparar
      this.attachGPTListeners(0);
      console.log('🎬 GPT Listeners registrados na abertura do modal');
    },

    init: function() {
      if (this.initialized) {
        console.warn('Plugin já foi inicializado');
        return;
      }

      this.initialized = true;
      this.injectStyles();
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => this.openModal(), 1000);
        });
      } else {
        setTimeout(() => this.openModal(), 1000);
      }
    }
  };

  window.DexxPlugin = DexxPlugin;
  DexxPlugin.init();

  window.addEventListener('dexxPrizeClick', function(e) {
    console.log('🎁 Evento dexxPrizeClick capturado:', e.detail);
    console.log('📊 Respostas do usuário:', e.detail.answers);
  });

  window.addEventListener('dexxPluginResponse', function(e) {
    console.log('📝 Resposta capturada - Step:', e.detail.step, 'Resposta:', e.detail.response);
  });

})();
