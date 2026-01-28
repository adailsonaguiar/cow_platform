# Dexx React Plugin (Vite)

Projeto Vite + React que reproduz a funcionalidade do `plugin-funcional.js` com suporte completo a **Rewarded Ads** via Google Publisher Tags.

## 🎯 Funcionalidades

- ✅ Modal automática após 1 segundo
- ✅ Formulário com perguntas dinâmicas
- ✅ Roleta de prêmios interativa
- ✅ **Integração completa com Rewarded Ads (GPT)**
- ✅ Eventos customizados para tracking
- ✅ Compatível com jobsmind.js

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
cd cow_plugin
npm install
```

### 2. Desenvolvimento

```bash
npm run dev
```

Abre em `http://localhost:5173` com hot reload.

### 3. Build para Produção

```bash
npm run build
```

Gera arquivos otimizados em `dist/`.

### 4. Preview da Build

```bash
npm run preview
```

## 📦 Integração em um Site

### Exemplo Básico

```html
<!DOCTYPE html>
<html>
<head>
  <!-- 1. Carregar Google Publisher Tag -->
  <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
  
  <!-- 2. Carregar script de anúncios -->
  <script src="jobsmind,js"></script>
</head>
<body>
  <!-- Seu conteúdo aqui -->
  
  <!-- 3. Container do plugin -->
  <div id="root"></div>
  
  <!-- 4. Script do plugin compilado -->
  <script type="module" src="dist/assets/index.js"></script>
</body>
</html>
```

Veja `example-usage.html` para um exemplo completo.

## 🎬 Como Funciona

### Fluxo Completo

1. **Modal abre automaticamente** após 1 segundo
2. **Usuário interage** com formulário ou roleta
3. **Botão "Pegar Prêmio"** aparece ao finalizar
4. **Ao clicar**, exibe vídeo de anúncio rewarded
5. **Após assistir**, modal fecha automaticamente

### Eventos Customizados

```javascript
// Resposta de cada pergunta
window.addEventListener('dexxPluginResponse', (e) => {
  console.log('Step:', e.detail.step);
  console.log('Resposta:', e.detail.response);
  console.log('Todas respostas:', e.detail.allAnswers);
});

// Clique no botão "Pegar Prêmio"
window.addEventListener('dexxPrizeClick', (e) => {
  console.log('Answers:', e.detail.answers);
  console.log('Type:', e.detail.componentType);
});
```

## 🔧 Arquitetura

### Componentes Principais

```
src/
├── App.jsx                    # Container principal
├── PluginModal.jsx           # Modal com lógica de estado
├── FormComponent.jsx         # Formulário de perguntas
├── RouletteComponent.jsx     # Roleta de prêmios
├── GPTRewardedManager.js     # 🔑 Gerenciador de anúncios rewarded
├── mockApi.js                # API mockada (desenvolvimento)
├── plugin-entry.jsx          # Entry point standalone
├── main.jsx                  # Entry point desenvolvimento
└── styles.css                # Estilos
```

### GPTRewardedManager

Componente crítico que gerencia a integração com Google Publisher Tags:

- **Registra listeners GPT**: rewardedSlotReady, rewardedSlotGranted, rewardedSlotClosed
- **Controla lifecycle**: unready → ready → opened → granted → closed
- **Exibe anúncios**: Chama `event.makeRewardedVisible()`
- **Observa DOM**: MutationObserver para detectar anúncios
- **Cleanup**: Remove listeners e limpa recursos

```javascript
import gptManager from './GPTRewardedManager'

// Inicializar ao abrir modal
gptManager.init(onCloseCallback)

// Exibir anúncio
gptManager.showRewarded()

// Limpar ao fechar
gptManager.cleanup()
```

## 📋 API do Plugin

### window.DexxPlugin

```javascript
// Abrir modal programaticamente
window.DexxPlugin.openModal()

// Fechar modal
window.DexxPlugin.closeModal()

// Inicializar (já é chamado automaticamente)
window.DexxPlugin.init()
```

## 🧪 Testes

### Teste de Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

### Teste de Produção

```bash
npm run build
python3 -m http.server 8000
```

Acesse:
- `http://localhost:8000/cow_plugin/test-react-rewarded.html` - Teste com logs
- `http://localhost:8000/cow_plugin/example-usage.html` - Exemplo de uso

### Verificar Console

Logs esperados ao funcionar corretamente:

```
✅ GPT Listeners registrados
✅ rewardedSlotReady - Anúncio PRONTO para exibição!
🎬 Chamando makeRewardedVisible() - Exibindo anúncio!
🎁 rewardedSlotGranted - Recompensa CONCEDIDA!
❌ rewardedSlotClosed - Anúncio fechado
```

## 🐛 Troubleshooting

### Anúncio não aparece

**Verificar:**
- [ ] `jobsmind,js` está carregado antes do plugin
- [ ] Google Publisher Tag está disponível
- [ ] Console não mostra erros
- [ ] Botão tem atributos: `data-av-rewarded="true"`, `data-google-rewarded="true"`

**Debug:**
```javascript
console.log('GPT disponível:', window.googletag?.apiReady)
console.log('Lifecycle:', gptManager.rewardedLifecycle)
```

### Modal não fecha após anúncio

**Verificar:**
- [ ] MutationObserver está iniciado
- [ ] Console mostra "✅ MutationObserver iniciado"
- [ ] Listener `rewardedSlotClosed` está registrado

Veja `VERIFICATION_CHECKLIST.md` para checklist completo.

## 📚 Documentação

- **RESUMO_EXECUTIVO.md** - Visão geral das mudanças
- **REWARDED_ADS_FIX.md** - Documentação técnica detalhada
- **VERIFICATION_CHECKLIST.md** - Checklist de verificação e troubleshooting
- **example-usage.html** - Exemplo de integração
- **test-react-rewarded.html** - Página de teste com logs

## 🔑 Requisitos

### Dependências

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0"
}
```

### Scripts Externos

O plugin requer que o site host carregue:

1. **Google Publisher Tag (GPT)**
   ```html
   <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
   ```

2. **JobsMind Ad Script**
   ```html
   <script src="jobsmind,js"></script>
   ```

## 🎓 Baseado Em

- **jobsmind.js** (linhas 1485-1600) - Implementação base de AVRewardedSlot
- **plugin-funcional.js** (linhas 380-580) - Lógica de listeners e watchers

## ⚠️ Notas Importantes

1. **Timing é crítico**: Listeners GPT devem ser registrados ANTES do modal abrir
2. **Atributos obrigatórios**: O botão precisa ter `data-av-rewarded="true"`
3. **Singleton**: GPTRewardedManager é singleton para manter estado consistente
4. **Cleanup**: Sempre limpar recursos ao fechar o modal

## 🎯 Diferenças do plugin.js Original

| Aspecto | plugin.js | plugin React |
|---------|-----------|--------------|
| Framework | Vanilla JS | React + Vite |
| Build | IIFE inline | ES Modules |
| Estado | Variáveis globais | React Hooks |
| Estilos | Inline CSS | CSS externo |
| API Mock | Hardcoded | mockApi.js |
| GPT Manager | Inline | GPTRewardedManager.js |

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique o console do navegador
2. Consulte `VERIFICATION_CHECKLIST.md`
3. Revise `REWARDED_ADS_FIX.md` para detalhes técnicos

## ✅ Status

- [x] Integração com Rewarded Ads completa
- [x] Compatível com jobsmind.js
- [x] Testes funcionando
- [x] Documentação completa
- [x] Exemplos de uso
- [x] Paridade com plugin-funcional.js
