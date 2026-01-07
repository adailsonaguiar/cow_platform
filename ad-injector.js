/**
 * Ad Injector - Simulação de Sistema de Injeção de Anúncios
 * Simula o comportamento de plataformas como Google AdSense, GTM, etc.
 */

(function() {
  'use strict';

  console.log('🎯 Ad Injector: Inicializando...');

  const AdInjector = {
    // Banco de dados simulado de anúncios
    adDatabase: {
      modal_top: {
        id: 'ad_001',
        type: 'coupon',
        title: '🎁 Oferta Exclusiva!',
        description: 'Ganhe 20% de desconto na sua primeira compra',
        ctaText: 'Resgatar Cupom',
        ctaAction: function() {
          console.log('📊 GTM Event: modal_ad_click', { 
            adId: 'ad_001',
            adType: 'modal_coupon',
            timestamp: new Date().toISOString()
          });
          alert('📊 Clique no anúncio da modal registrado!\n🎁 Cupom: DEXX20\n\n✅ Código copiado para área de transferência');
        },
        impressionTracked: false
      },
      banner_promo: {
        id: 'ad_002',
        type: 'promotional',
        title: '⚡ Super Oferta Relâmpago',
        description: 'Descontos de até 70% em produtos selecionados',
        ctaText: 'Ver Produtos',
        ctaAction: function() {
          console.log('📊 GTM Event: dynamic_ad_click', { 
            adId: 'ad_002',
            adType: 'promotional',
            timestamp: new Date().toISOString()
          });
          alert('📊 Anúncio dinâmico clicado!');
        },
        impressionTracked: false
      }
    },

    // Gera o HTML do anúncio
    generateAdHTML: function(adData) {
      const adId = `dexx-injected-ad-${Date.now()}`;
      
      return `
        <div class="dexx-modal-ad dexx-injected-ad" data-ad-id="${adData.id}">
          <p class="dexx-modal-ad-title">${adData.title}</p>
          <p class="dexx-modal-ad-text">${adData.description}</p>
          <a href="#" class="dexx-modal-ad-link" data-ad-action="${adData.id}">${adData.ctaText}</a>
        </div>
      `;
    },

    // Injeta o anúncio em um container específico
    injectAd: function(containerId, adKey) {
      const container = document.querySelector(`[data-ad-container="${containerId}"]`);
      
      if (!container) {
        console.warn(`⚠️ Ad Injector: Container "${containerId}" não encontrado`);
        return false;
      }

      const adData = this.adDatabase[adKey];
      
      if (!adData) {
        console.warn(`⚠️ Ad Injector: Anúncio "${adKey}" não encontrado no banco de dados`);
        return false;
      }

      // Simula delay de rede (como um ad server real)
      setTimeout(() => {
        container.innerHTML = this.generateAdHTML(adData);
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s ease-in';
        
        // Animação de fade-in
        setTimeout(() => {
          container.style.opacity = '1';
        }, 50);

        // Adiciona event listener ao CTA
        const ctaButton = container.querySelector('.dexx-modal-ad-link');
        if (ctaButton) {
          ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            adData.ctaAction();
          });
        }

        // Tracking de impressão
        this.trackImpression(adData);

        console.log(`✅ Ad Injector: Anúncio "${adData.id}" injetado em "${containerId}"`);
      }, Math.random() * 300 + 100); // 100-400ms de delay

      return true;
    },

    // Tracking de impressão do anúncio
    trackImpression: function(adData) {
      if (!adData.impressionTracked) {
        console.log('📊 GTM Event: ad_impression', {
          adId: adData.id,
          adType: adData.type,
          timestamp: new Date().toISOString()
        });
        adData.impressionTracked = true;
      }
    },

    // Observer para detectar novos containers de anúncio
    observeAdContainers: function() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              // Procura por containers de anúncio
              const adContainers = node.querySelectorAll ? 
                node.querySelectorAll('[data-ad-container]') : [];
              
              // Inclui o próprio nó se for um container
              if (node.hasAttribute && node.hasAttribute('data-ad-container')) {
                this.handleNewContainer(node);
              }
              
              // Processa containers filhos
              adContainers.forEach((container) => {
                this.handleNewContainer(container);
              });
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      console.log('👁️ Ad Injector: Observer ativo, monitorando novos containers');
    },

    // Processa novo container detectado
    handleNewContainer: function(container) {
      const containerId = container.getAttribute('data-ad-container');
      const adType = container.getAttribute('data-ad-type') || 'modal_top';
      
      console.log(`🔍 Ad Injector: Novo container detectado: "${containerId}"`);
      
      // Simula decisão de qual anúncio exibir (como um ad server real)
      const adKey = adType === 'promotional' ? 'banner_promo' : 'modal_top';
      
      this.injectAd(containerId, adKey);
    },

    // Inicializa o sistema de injeção
    init: function() {
      console.log('✅ Ad Injector: Sistema inicializado');
      
      // Aguarda o DOM estar pronto
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.observeAdContainers();
          this.scanExistingContainers();
        });
      } else {
        this.observeAdContainers();
        this.scanExistingContainers();
      }
    },

    // Escaneia containers já existentes
    scanExistingContainers: function() {
      const existingContainers = document.querySelectorAll('[data-ad-container]');
      existingContainers.forEach((container) => {
        this.handleNewContainer(container);
      });
    }
  };

  // Expõe globalmente para debug
  window.AdInjector = AdInjector;

  // Inicializa automaticamente
  AdInjector.init();

  // Simula evento GTM de script carregado
  setTimeout(() => {
    const event = new CustomEvent('adInjectorReady', {
      detail: { 
        totalAds: Object.keys(AdInjector.adDatabase).length,
        timestamp: new Date()
      }
    });
    window.dispatchEvent(event);
    console.log('📢 Ad Injector: Sistema pronto para injetar anúncios');
  }, 100);

})();
