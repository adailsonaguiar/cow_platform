# 🎁 Sistema de Anúncios Recompensados

## 📋 Resumo das Implementações

O plugin agora possui um sistema completo de gerenciamento de anúncios recompensados, baseado nos exemplos do `overlay.example.js` e `overlay.example.html`.

## ✨ Funcionalidades Implementadas

### 1. **Tela Final com Link de Prêmio**
```html
<a href="" 
   class="dexx-modal-prize-link av-rewarded" 
   data-av-rewarded="true" 
   data-google-rewarded="true" 
   data-google-interstitial="false">
  🎁 Pegar Prêmio
</a>
```

### 2. **Links Ocultos para Integração**
Dois links ocultos adicionais para compatibilidade com sistemas de anúncios:
- `#dexx-hidden-link-1`
- `#dexx-hidden-link-2`

### 3. **Sistema de Watchers**

#### **MutationObserver**
Monitora quando o offerwall (`#av-offerwall__wrapper`) é adicionado ou removido do DOM:
```javascript
this.mutationObserver = new MutationObserver((mutations) => {
  // Detecta quando offerwall é removido
  if (node.id === 'av-offerwall__wrapper') {
    this.safeCloseOnce();
  }
});
```

#### **Polling Interval**
Verifica a cada 300ms:
- Presença do offerwall no DOM
- Cookie `avOfferWallRewarded=true`
- Estado do anúncio

#### **Google Publisher Tag Listeners**
Integração com eventos do GPT:
```javascript
googletag.pubads().addEventListener('rewardedSlotClosed', () => {
  this.safeCloseOnce();
});
```

### 4. **Sistema de Fallback**
Se o anúncio não aparecer em 3 segundos após o clique:
```javascript
this.fallbackTimer = setTimeout(() => {
  console.warn('⚠️ Fallback ativado');
  this.safeCloseOnce();
}, 3000);
```

### 5. **Proteção contra Fechamento Múltiplo**
```javascript
safeCloseOnce: function() {
  if (this.closedOnce) return;
  this.closedOnce = true;
  this.closeModal();
}
```

## 🎯 Fluxo de Funcionamento

```
1. Usuário responde Pergunta 1 ✅
           ↓
2. Usuário responde Pergunta 2 ✅
           ↓
3. Tela Final é exibida com "🎁 Pegar Prêmio"
           ↓
4. Usuário clica no botão
           ↓
5. Sistema inicia watchers e fallback timer
           ↓
6. Anúncio recompensado é exibido (offerwall)
           ↓
7. Watchers detectam offerwall no DOM
           ↓
8. Fallback timer é cancelado
           ↓
9. Usuário fecha o anúncio
           ↓
10. Watchers detectam remoção do offerwall
           ↓
11. Modal principal é fechado automaticamente ✅
```

## 🔧 Configuração

### **Variáveis de Controle**
```javascript
const DexxPlugin = {
  offerwallSeen: false,      // Detectou offerwall?
  pollId: null,              // ID do interval de polling
  mutationObserver: null,    // Observer de mudanças no DOM
  pollTimeout: null,         // Timeout de segurança (60s)
  fallbackTimer: null,       // Timer de fallback (3s)
  closedOnce: false          // Previne fechamento múltiplo
}
```

### **Timeouts Configuráveis**
```javascript
// Fallback - Fecha se anúncio não aparecer
const fallbackMs = 3000; // 3 segundos

// Polling - Verifica estado do anúncio
const pollingInterval = 300; // 300ms

// Timeout de segurança - Para todos os watchers
const safetyTimeout = 60000; // 60 segundos
```

## 📊 Eventos Disparados

### **dexxPrizeClick**
Disparado quando usuário clica em "Pegar Prêmio":
```javascript
window.addEventListener('dexxPrizeClick', function(e) {
  console.log(e.detail.answers);    // Respostas do quiz
  console.log(e.detail.timestamp);  // Timestamp do clique
});
```

### **dexxPluginResponse**
Disparado a cada resposta do quiz:
```javascript
window.addEventListener('dexxPluginResponse', function(e) {
  console.log(e.detail.step);       // Número da pergunta
  console.log(e.detail.response);   // sim/não
  console.log(e.detail.allAnswers); // Todas as respostas
});
```

## 🧪 Teste

Abra o arquivo `test-rewarded-ad.html` no navegador para testar:

1. **Console de Eventos**: Mostra todos os eventos em tempo real
2. **Status Visual**: Indica estado do anúncio
3. **Simulação**: Botão para simular offerwall manualmente
4. **Integração Completa**: Testa todo o fluxo end-to-end

### **Comandos de Teste**
```javascript
// Reabrir modal
DexxPlugin.openModal();

// Simular offerwall
simulateOfferwall();

// Limpar console
clearConsole();
```

## 🔌 Integração com ActView/JobsMind

O sistema é totalmente compatível com:
- ✅ ActView rewarded ads
- ✅ Google Ad Manager (GPT)
- ✅ Offerwalls
- ✅ Interstitial ads

### **Classes Necessárias**
```html
<!-- Link principal -->
<a class="av-rewarded" 
   data-av-rewarded="true"
   data-google-rewarded="true"
   data-google-interstitial="false">
```

### **Cookies Monitorados**
- `avOfferWallRewarded=true` - Recompensa entregue
- `avInterstitialViewed=true` - Intersticial visualizado

## 📝 Logs de Debugging

O sistema registra logs detalhados:

```
🎁 Link "Pegar Prêmio" clicado!
👀 Iniciando watchers de anúncios...
✅ Offerwall detectado
✅ GPT Listeners configurados
🛑 Parando watchers...
📊 Anúncio recompensado fechado
```

## ⚙️ Personalização

### **Alterar Tempo de Fallback**
```javascript
const fallbackMs = 5000; // 5 segundos ao invés de 3
```

### **Desabilitar Fallback**
```javascript
// Comentar estas linhas:
// this.fallbackTimer = setTimeout(() => {
//   this.safeCloseOnce();
// }, fallbackMs);
```

### **Adicionar Mais Links Ocultos**
```html
<a id="dexx-hidden-link-3" 
   class="av-rewarded" 
   style="display:none" 
   data-av-rewarded="true"></a>
```

## 🎨 Estilos CSS

Novos estilos adicionados:
```css
.dexx-modal-options {
  text-align: center;
}

.dexx-modal-footer {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 20px;
}
```

## 🚀 Deploy

1. Inclua o `plugin.js` no seu site
2. Configure os containers de anúncios
3. O sistema funcionará automaticamente
4. Monitore eventos via `console.log` ou listeners

## 📚 Referências

- `overlay.example.js` - Lógica de referência
- `overlay.example.html` - HTML de referência
- `test-rewarded-ad.html` - Página de testes completa

---

**Versão**: 1.1.0  
**Última atualização**: Janeiro 2026  
**Compatibilidade**: ActView, Google Ad Manager, GPT
