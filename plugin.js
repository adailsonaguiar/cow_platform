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
    `,

    // Injeta os estilos CSS na página
    injectStyles: function() {
      const styleElement = document.createElement('style');
      styleElement.textContent = this.styles;
      document.head.appendChild(styleElement);
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
            <div data-ad-container="modal-top" data-ad-type="modal_top"></div>
            
            <h2 class="dexx-modal-title">Pergunta Importante</h2>
            <p class="dexx-modal-question">
              Você está gostando da sua experiência neste site?
            </p>
            <div class="dexx-modal-buttons">
              <button class="dexx-modal-button dexx-modal-button-no">Não</button>
              <button class="dexx-modal-button dexx-modal-button-yes">Sim</button>
            </div>
          </div>
        </div>
      `;

      return overlay;
    },

    // Gerencia eventos do modal
    attachEvents: function() {
      const yesButton = this.modalElement.querySelector('.dexx-modal-button-yes');
      const noButton = this.modalElement.querySelector('.dexx-modal-button-no');
      const closeButton = this.modalElement.querySelector('.dexx-modal-close');

      yesButton.addEventListener('click', () => this.handleResponse('sim'));
      noButton.addEventListener('click', () => this.handleResponse('não'));
      closeButton.addEventListener('click', () => this.closeModal());

      // Fecha ao clicar fora do modal
      this.modalElement.addEventListener('click', (e) => {
        if (e.target === this.modalElement) {
          this.closeModal();
        }
      });

      // Fecha com ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modalElement) {
          this.closeModal();
        }
      });
    },

    // Trata a resposta do usuário
    handleResponse: function(response) {
      console.log('Resposta do usuário:', response);
      
      // Dispara evento customizado
      const event = new CustomEvent('dexxPluginResponse', {
        detail: { response: response }
      });
      window.dispatchEvent(event);

      this.closeModal();
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
        }, 200);
      }
    },

    // Abre o modal
    openModal: function() {
      if (this.modalElement) {
        console.warn('Modal já está aberto');
        return;
      }

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
