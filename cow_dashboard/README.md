# COW Platform - Dashboard

Dashboard moderno e profissional para gerenciamento de blocos interativos COW.

## 🚀 Tecnologias

- **React 18** - Biblioteca de UI
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilização
- **Radix UI** - Componentes acessíveis e modernos
- **Axios** - Cliente HTTP para comunicação com API
- **Lucide React** - Ícones modernos

## 🎨 Design System

O dashboard segue princípios de design moderno inspirados em produtos como Vercel, Linear e Notion:

- **Grid de 12 colunas** para layouts flexíveis e responsivos
- **Espaçamento consistente** baseado em escala de 8px
- **Tipografia hierárquica** com a fonte Inter
- **Paleta de cores neutras** com cor de destaque configurável
- **Componentes reutilizáveis** com Radix UI
- **Animações sutis** e transições suaves
- **Design responsivo** mobile-first

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 🔧 Configuração

O dashboard se conecta automaticamente ao backend NestJS em `http://localhost:3000`.

Para alterar a URL da API, edite o arquivo `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000';
```

## 📋 Funcionalidades

### Gerenciamento de Blocos COW

- ✅ Criar novos blocos interativos
- ✅ Editar blocos existentes
- ✅ Duplicar blocos
- ✅ Excluir blocos
- ✅ Buscar por site ou URL
- ✅ Filtrar por tipo de bloco
- ✅ Visualização em grid responsivo

### Formatos de Blocos Disponíveis

1. **Quiz** ❓ - Interactive quiz format
2. **Spin Wheel** 🎡 - Spin to win rewards
3. **Scratch Card** 🎫 - Scratch to reveal
4. **Countdown** ⏱️ - Time-limited offers
5. **Gift Box** 🎁 - Surprise rewards

### Idiomas Suportados

- 🇧🇷 Português (BR)
- 🇺🇸 English (US)
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

## 🏗️ Estrutura do Projeto

```
cow_dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes UI base (Radix UI)
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Dialog.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   └── Toast.jsx
│   │   ├── CowBlockCard.jsx # Card de exibição de bloco
│   │   └── CowBlockForm.jsx # Formulário de criação/edição
│   ├── pages/
│   │   └── Dashboard.jsx    # Página principal
│   ├── services/
│   │   └── api.js           # Cliente API e endpoints
│   ├── utils/
│   │   └── helpers.js       # Funções utilitárias
│   ├── App.jsx              # Componente raiz
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Próximos Passos

1. **Autenticação** - Adicionar sistema de login e autenticação
2. **Analytics** - Dashboard com métricas de performance dos blocos
3. **Temas** - Suporte a modo escuro/claro
4. **Exportação** - Exportar configurações em JSON/CSV
5. **Versionamento** - Histórico de alterações dos blocos
6. **Preview** - Visualizar blocos antes de salvar

## 🐛 Troubleshooting

### Backend não está respondendo

Certifique-se de que o backend NestJS está rodando em `http://localhost:3000`:

```bash
cd ../cow_backend
npm run start:dev
```

### Erro de CORS

Se encontrar erros de CORS, adicione a configuração no backend NestJS:

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true,
});
```

## 📝 Licença

Este projeto faz parte da plataforma COW.
