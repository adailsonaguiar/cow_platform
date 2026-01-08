(function() {
  'use strict';

  // Verifica se o plugin já foi inicializado
  if (window.DexxPlugin) {
    console.warn('Dexx Plugin já foi inicializado');
    return;
  }

  // Objeto principal do plugin
  const DexxPlugin = {
    initialized: false,
    modalElement: null,
    currentStep: 1, // Controla qual pergunta está sendo exibida
    answers: {}, // Armazena as respostas
    
    // Sistema de watchers para anúncios
    offerwallSeen: false,
    pollId: null,
    mutationObserver: null,
    pollTimeout: null,
    fallbackTimer: null,
    closedOnce: false,

    // Perguntas do questionário
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

    // Estilos CSS do modal
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

      @keyframes dexx-modal-fadeout {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
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

      .dexx-modal-ad {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        border: 2px solid #ff9a76;
        position: relative;
      }

      .dexx-modal-ad::before {
        content: '📢 ANÚNCIO';
        position: absolute;
        top: -10px;
        left: 10px;
        background: #ff6b6b;
        color: white;
        font-size: 10px;
        padding: 3px 8px;
        border-radius: 3px;
        font-weight: bold;
      }

      .dexx-modal-ad-title {
        font-size: 16px;
        font-weight: bold;
        color: #d63031;
        margin: 0 0 8px 0;
      }

      .dexx-modal-ad-text {
        font-size: 13px;
        color: #555;
        margin: 0 0 10px 0;
      }

      .dexx-modal-ad-link {
        display: inline-block;
        background: #ff6b6b;
        color: white;
        padding: 6px 16px;
        border-radius: 4px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        transition: background 0.2s;
      }

      .dexx-modal-ad-link:hover {
        background: #ee5a52;
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
    `,

    // Injeta os estilos CSS na página
    injectStyles: function() {
      const styleElement = document.createElement('style');
      styleElement.textContent = this.styles;
      document.head.appendChild(styleElement);
    },
    // Cria o HTML do modal com base no step atual
    getModalContent: function() {
      if (this.currentStep <= this.questions.length) {
        // Exibe pergunta atual
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
        // Exibe tela final com link de prêmio
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
          v2.3
          <div class="dexx-modal-options">
            <a href="#"
               class="dexx-modal-prize-link av-rewarded" 
               data-av-rewarded="true" 
               data-google-rewarded="true" 
               data-google-interstitial="false"
               data-av-onclick="return false"
               onclick=""
               role="button" 
               tabindex="0">
              🎁 Pegar Prêmio
            </a>
          </div>
          <div class="dexx-modal-footer">Veja a recomendação patrocinada para continuar</div>
        `;
      }
    },
    // Cria o HTML do modal
    createModal: function() {
      const overlay = document.createElement('div');
      overlay.className = 'dexx-modal-overlay';
      overlay.innerHTML = `
        <div class="dexx-modal-content-wrapper">
          <div class="dexx-modal-content">
            <button class="dexx-modal-close" aria-label="Fechar">&times;</button>
            
            <!-- Container vazio onde o anúncio será injetado dinamicamente -->
            
            <!-- Conteúdo dinâmico -->
            <div class="dexx-modal-dynamic-content">
              ${this.getModalContent()}
            </div>
          </div>
        </div>
      `;

      return overlay;
    },

    // Atualiza o conteúdo do modal
    updateModalContent: function() {
      const contentArea = this.modalElement.querySelector('.dexx-modal-dynamic-content');
      if (contentArea) {
        contentArea.innerHTML = this.getModalContent();
        this.attachButtonEvents();
        
        // Se estamos na tela final, notifica o sistema de anúncios
        if (this.currentStep > this.questions.length) {
          this.setupRewardedAd();
        }
      }
    },

    // Configura o anúncio recompensado após tela final aparecer
    setupRewardedAd: function() {
      console.log('🎬 Configurando anúncio recompensado...');
      
      // Aguarda um momento para garantir que o DOM está pronto
      setTimeout(() => {
        const prizeLink = this.modalElement.querySelector('.dexx-modal-prize-link');
        
        if (prizeLink) {
          // Garante que o link tem o atributo href
          if (!prizeLink.hasAttribute('href')) {
            prizeLink.setAttribute('href', '');
          }
          
          // Força re-configuração dos atributos (caso ActView tenha perdido)
          prizeLink.setAttribute('data-av-rewarded', 'true');
          prizeLink.setAttribute('data-google-rewarded', 'true');
          prizeLink.setAttribute('data-google-interstitial', 'false');
          
          console.log('✅ Link de prêmio configurado:', prizeLink);
          
          // Dispara evento customizado para sistemas de anúncios detectarem
          const event = new CustomEvent('dexxRewardedAdReady', {
            detail: { 
              element: prizeLink,
              answers: this.answers
            }
          });
          window.dispatchEvent(event);
        }
      }, 100);
    },

    // Gerencia eventos dos botões
    attachButtonEvents: function() {
      const buttons = this.modalElement.querySelectorAll('.dexx-modal-button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const answer = button.getAttribute('data-answer');
          this.handleResponse(answer);
        });
      });

      // Evento do link de prêmio
      const prizeLink = this.modalElement.querySelector('.dexx-modal-prize-link');
      if (prizeLink && !prizeLink.__dexxBound) {
        prizeLink.addEventListener('click', (e) => {
          // NÃO previne preventDefault para deixar ActView/Google processar o link #goog_rewarded
          console.log('🎁 Link "Pegar Prêmio" clicado!');
          console.log('🔗 URL:', e.target.href);
          
          // Armazena timestamp para controle
          try {
            localStorage.setItem('dexx_prize_clicked', String(Date.now()));
            localStorage.setItem('dexx_once', '1');
          } catch(_) {}
          
          // Dispara evento customizado
          const event = new CustomEvent('dexxPrizeClick', {
            detail: { 
              answers: this.answers,
              timestamp: new Date().toISOString()
            }
          });
          window.dispatchEvent(event);
          
          // Limpa fallback se existir
          if (this.fallbackTimer) {
            clearTimeout(this.fallbackTimer);
            this.fallbackTimer = null;
          }
          
          // Configura fallback (fecha após 30 segundos se anúncio não fechar)
          const fallbackMs = 30000; // 30 segundos
          this.fallbackTimer = setTimeout(() => {
            if (!this.offerwallSeen) {
              console.warn('⚠️ Timeout: anúncio não detectado em 30s, fechando modal');
              this.safeCloseOnce();
            }
          }, fallbackMs);
          
          // Inicia watchers para detectar anúncios
          this.startWatchers();
        });
        prizeLink.__dexxBound = true;
      }
    },

    // Fecha o modal de forma segura (apenas uma vez)
    safeCloseOnce: function() {
      if (this.closedOnce) return;
      this.closedOnce = true;
      this.closeModal();
    },

    // Anexa listeners do Google Publisher Tag
    attachGPTListeners: function(attempt) {
      attempt = attempt || 0;
      const ready = !!(window.googletag && googletag.apiReady && googletag.pubads);
      
      if (!ready) {
        if (attempt > 200) return;
        return setTimeout(() => {
          this.attachGPTListeners(attempt + 1);
        }, 100);
      }
      
      try {
        const pubads = googletag.pubads();
        
        // Listener para quando anúncio recompensado é fechado
        pubads.addEventListener('rewardedSlotClosed', () => {
          console.log('📊 Anúncio recompensado fechado');
          this.stopWatchers();
          this.safeCloseOnce();
        });
        
        // Listener para quando anúncio intersticial manual é fechado
        pubads.addEventListener('gameManualInterstitialSlotClosed', () => {
          console.log('📊 Anúncio intersticial fechado');
          this.stopWatchers();
          this.safeCloseOnce();
        });
        
        console.log('✅ GPT Listeners configurados');
      } catch(e) {
        console.error('❌ Erro ao configurar GPT listeners:', e);
      }
    },

    // Inicia watchers para detectar anúncios
    startWatchers: function() {
      console.log('👀 Iniciando watchers de anúncios...');
      
      // MutationObserver para detectar offerwall sendo removido
      try {
        this.mutationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            // Detecta quando offerwall é ADICIONADO
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
                
                // Detecta qualquer elemento de anúncio do Google
                if (node.tagName === 'IFRAME' || 
                    (node.querySelector && node.querySelector('iframe[id*="google"]'))) {
                  console.log('✅ Iframe de anúncio detectado');
                  this.offerwallSeen = true;
                  if (this.fallbackTimer) {
                    clearTimeout(this.fallbackTimer);
                    this.fallbackTimer = null;
                  }
                }
              });
            }
            
            // Detecta quando offerwall é REMOVIDO
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
      
      // Polling para detectar offerwall e cookies
      this.pollId = setInterval(() => {
        const offerwallElement = document.getElementById('av-offerwall__wrapper');
        
        // Se offerwall apareceu
        if (offerwallElement) {
          if (!this.offerwallSeen) {
            console.log('✅ Offerwall detectado via polling');
          }
          this.offerwallSeen = true;
          if (this.fallbackTimer) {
            clearTimeout(this.fallbackTimer);
            this.fallbackTimer = null;
          }
        }
        
        // Se offerwall sumiu depois de ter aparecido
        if (this.offerwallSeen && !offerwallElement) {
          console.log('✅ Offerwall fechado - encerrando modal');
          this.stopWatchers();
          this.safeCloseOnce();
        }
        
        // Verifica cookie de recompensa
        if (document.cookie.indexOf('avOfferWallRewarded=true') !== -1) {
          console.log('✅ Cookie de recompensa detectado');
          this.stopWatchers();
          this.safeCloseOnce();
        }
        
        // Verifica cookie de intersticial
        if (document.cookie.indexOf('avInterstitialViewed=true') !== -1) {
          console.log('✅ Cookie de intersticial detectado');
          this.stopWatchers();
          this.safeCloseOnce();
        }
      }, 300);
      
      // Timeout de segurança (90 segundos - para anúncios de vídeo longos)
      this.pollTimeout = setTimeout(() => {
        console.warn('⏱️ Timeout de watchers atingido (90s)');
        this.stopWatchers();
        // Não fecha automaticamente no timeout, deixa usuário fechar
      }, 90000);
      
      // Anexa listeners do GPT
      this.attachGPTListeners(0);
    },

    // Para todos os watchers
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

    // Gerencia eventos do modal
    attachEvents: function() {
      const closeButton = this.modalElement.querySelector('.dexx-modal-close');

      closeButton.addEventListener('click', () => this.closeModal());

      // Fecha ao clicar fora do modal
      this.modalElement.addEventListener('click', (e) => {
        if (e.target === this.modalElement) {
          this.closeModal();
        }
      });

      // Fecha com ESC
      const handleEscape = (e) => {
        if (e.key === 'Escape' && this.modalElement) {
          this.closeModal();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

      // Anexa eventos dos botões
      this.attachButtonEvents();
    },

    // Trata a resposta do usuário
    handleResponse: function(response) {
      console.log(`Resposta - Step ${this.currentStep}:`, response);
      
      // Armazena a resposta
      this.answers[`step${this.currentStep}`] = response;

      // Dispara evento customizado
      const event = new CustomEvent('dexxPluginResponse', {
        detail: { 
          step: this.currentStep,
          response: response,
          allAnswers: this.answers
        }
      });
      window.dispatchEvent(event);

      // Avança para próxima pergunta ou finaliza
      if (this.currentStep < this.questions.length) {
        this.currentStep++;
        this.updateModalContent();
      } else {
        // Mostra tela final
        this.currentStep++;
        this.updateModalContent();
      }
    },

    // Fecha o modal
    closeModal: function() {
      if (this.modalElement) {
        // Para todos os watchers antes de fechar
        this.stopWatchers();
        
        this.modalElement.style.animation = 'dexx-modal-fadeout 0.2s ease-out';
        setTimeout(() => {
          if (this.modalElement && this.modalElement.parentNode) {
            this.modalElement.parentNode.removeChild(this.modalElement);
          }
          this.modalElement = null;
          this.currentStep = 1;
          this.answers = {};
          this.closedOnce = false;
          this.offerwallSeen = false;
        }, 200);
      }
    },

    // Abre o modal
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
    },

    // Inicializa o plugin
    init: function() {
      if (this.initialized) {
        console.warn('Plugin já foi inicializado');
        return;
      }

      this.initialized = true;
      this.injectStyles();
      
      // Aguarda o DOM estar pronto
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => this.openModal(), 1000);
        });
      } else {
        setTimeout(() => this.openModal(), 1000);
      }
    }
  };

  // Expõe o plugin globalmente
  window.DexxPlugin = DexxPlugin;

  // Inicializa automaticamente
  DexxPlugin.init();

  // Listener global para monitorar eventos de prêmio
  window.addEventListener('dexxPrizeClick', function(e) {
    console.log('🎁 Evento dexxPrizeClick capturado:', e.detail);
    console.log('📊 Respostas do usuário:', e.detail.answers);
  });

  // Listener para monitorar respostas das perguntas
  window.addEventListener('dexxPluginResponse', function(e) {
    console.log('📝 Resposta capturada - Step:', e.detail.step, 'Resposta:', e.detail.response);
  });

})();
