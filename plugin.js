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
          <p class="dexx-modal-question">
            Como agradecimento, preparamos um prêmio especial para você!
          </p>
          <div class="qo__options">
          xxx
<a href class="dexx-modal-prize-link av-rewarded" data-av-rewarded="true" onclick="" role="button" tabindex="0" data-av-onclick="return false" data-google-rewarded="true" data-google-interstitial="false">
 🎁 Pegar Prêmio</a>

 <a id="qo-hidden-link-1" class="av-rewarded" style="display:none" data-av-rewarded="true" data-google-rewarded="true" data-google-interstitial="false"></a>
</div>
<a id="hidden-link" class="av-rewarded" style="display:none" data-av-rewarded="true" data-google-rewarded="true" data-google-interstitial="false"></a>
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
      }
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
      if (prizeLink) {
        prizeLink.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('🎁 Link "Pegar Prêmio" clicado!');
          
          // Dispara evento customizado
          const event = new CustomEvent('dexxPrizeClick', {
            detail: { 
              answers: this.answers,
              timestamp: new Date().toISOString()
            }
          });
          window.dispatchEvent(event);
          
          // Você pode adicionar aqui a lógica do prêmio
          // Por exemplo: abrir um anúncio recompensado, redirecionar, etc.
        });
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
        this.modalElement.style.animation = 'dexx-modal-fadeout 0.2s ease-out';
        setTimeout(() => {
          if (this.modalElement && this.modalElement.parentNode) {
            this.modalElement.parentNode.removeChild(this.modalElement);
          }
          this.modalElement = null;
          this.currentStep = 1;
          this.answers = {};
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

})();
