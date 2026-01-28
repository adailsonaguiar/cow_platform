# Dexx Plugin

Um plugin simples em JavaScript vanilla que exibe uma modal sobre qualquer site hospedeiro.

## 📋 Características

- ✅ JavaScript Vanilla puro (sem dependências)
- ✅ Fácil de integrar em qualquer site
- ✅ Modal responsivo e estilizado
- ✅ Fecha com ESC, clique fora ou botões
- ✅ Emite eventos customizados para capturar respostas
- ✅ Animações suaves
- ✅ Design moderno

## 🚀 Como Usar

### Instalação Básica

Adicione o script antes do fechamento da tag `</body>` no seu HTML:

```html
<script src="plugin.js"></script>
```

### Capturar Resposta do Usuário

Para capturar a resposta do usuário, adicione um listener para o evento customizado:

```javascript
window.addEventListener('dexxPluginResponse', function(event) {
    const response = event.detail.response; // 'sim' ou 'não'
    console.log('Usuário respondeu:', response);
    
    // Faça algo com a resposta
    if (response === 'sim') {
        // Usuário respondeu sim
    } else {
        // Usuário respondeu não
    }
});
```

### Controle Manual

O plugin se inicializa automaticamente, mas você pode controlá-lo manualmente:

```javascript
// Abrir o modal manualmente
window.DexxPlugin.openModal();

// Fechar o modal manualmente
window.DexxPlugin.closeModal();
```

## 🎨 Personalização

Para personalizar a aparência do modal, edite a seção `styles` dentro do arquivo `plugin.js`. Todas as classes CSS começam com o prefixo `dexx-modal-` para evitar conflitos com o site hospedeiro.

### Alterar a Pergunta

Edite o método `createModal()` no arquivo `plugin.js` e modifique o HTML:

```javascript
<p class="dexx-modal-question">
    Sua nova pergunta aqui?
</p>
```

### Alterar o Tempo de Exibição

Por padrão, o modal aparece 1 segundo após o carregamento da página. Para alterar:

```javascript
// Procure por estas linhas no plugin.js
setTimeout(() => this.openModal(), 1000); // 1000ms = 1 segundo
```

## 📁 Estrutura do Projeto

```
plugin_dexx/
├── plugin.js      # Script principal do plugin
├── index.html     # Página de demonstração
└── README.md      # Este arquivo
```

## 🧪 Testar

1. Abra o arquivo `index.html` em um navegador
2. O modal aparecerá automaticamente após 1 segundo
3. Interaja com os botões e observe o log de respostas

## 🔒 Segurança

O plugin:
- Usa IIFE (Immediately Invoked Function Expression) para evitar poluir o escopo global
- Verifica se já foi inicializado para evitar múltiplas instâncias
- Usa `z-index` alto (999999) para garantir que o modal apareça sobre todo o conteúdo

## 📝 Licença

Projeto livre para uso pessoal e comercial.
