# 📝 Estrutura de Dados - COW Platform

## Formato dos Dados Salvos no Backend

### Estrutura Geral (DTO)
```typescript
{
  site: string;      // Identificador do site
  url: string;       // URL da página
  type: string;      // Tipo do bloco
  data: object;      // Dados específicos do bloco
}
```

---

## 1. Spin Wheel (Roleta) 🎡

### Tipo
```json
"type": "spinwheel"
```

### Data
```json
{
  "language": "pt-BR",
  "prizes": [
    {
      "id": 1,
      "label": "20% OFF",
      "color": "#FF6B6B",
      "value": 20
    },
    {
      "id": 2,
      "label": "30% OFF",
      "color": "#4ECDC4",
      "value": 30
    }
  ]
}
```

### Exemplo Completo
```json
{
  "site": "minhaloja.com",
  "url": "https://minhaloja.com/checkout",
  "type": "spinwheel",
  "data": {
    "language": "pt-BR",
    "prizes": [
      {"id": 1, "label": "10% OFF", "color": "#FF6B6B", "value": 10},
      {"id": 2, "label": "20% OFF", "color": "#4ECDC4", "value": 20},
      {"id": 3, "label": "30% OFF", "color": "#FFE66D", "value": 30}
    ]
  }
}
```

---

## 2. Quiz (Questionário) ❓

### Tipo
```json
"type": "quiz"
```

### Data
```json
{
  "language": "pt-BR",
  "questions": [
    {
      "id": 1,
      "question": "Como você avalia nosso serviço?",
      "options": ["Excelente", "Bom", "Regular", "Ruim"],
      "correctAnswer": "Excelente"
    }
  ]
}
```

### Exemplo Completo
```json
{
  "site": "feedback.com",
  "url": "https://feedback.com/pesquisa",
  "type": "quiz",
  "data": {
    "language": "pt-BR",
    "questions": [
      {
        "id": 1,
        "question": "Você gostou do produto?",
        "options": ["Sim", "Não", "Talvez"],
        "correctAnswer": "Sim"
      },
      {
        "id": 2,
        "question": "Recomendaria para amigos?",
        "options": ["Com certeza", "Provavelmente", "Não"],
        "correctAnswer": "Com certeza"
      }
    ]
  }
}
```

---

## 3. Scratch Card (Raspadinha) 🎫

### Tipo
```json
"type": "scratch"
```

### Data
```json
{
  "language": "pt-BR",
  "prizes": [
    {
      "id": 1,
      "label": "R$ 50 de desconto",
      "probability": 15,
      "image": "https://..."
    },
    {
      "id": 2,
      "label": "Frete grátis",
      "probability": 30,
      "image": "https://..."
    }
  ]
}
```

---

## 4. Countdown (Contador) ⏱️

### Tipo
```json
"type": "countdown"
```

### Data
```json
{
  "language": "pt-BR",
  "title": "Oferta Black Friday",
  "endDate": "2026-11-29T23:59",
  "message": "Oferta expirada",
  "discount": 40,
  "code": "BLACK40"
}
```

---

## 5. Gift Box (Presente) 🎁

### Tipo
```json
"type": "gift"
```

### Data
```json
{
  "language": "pt-BR",
  "title": "Você ganhou um presente!",
  "description": "Clique para revelar",
  "prize": "25% de desconto",
  "buttonText": "Abrir Presente",
  "image": "https://exemplo.com/imagem.png"
}
```

---

## Buscando Dados na API

### Buscar todos os blocos
```bash
GET /cows
```

### Buscar por site
```bash
GET /cows?site=minhaloja.com
```

### Buscar por tipo
```bash
GET /cows?type=spinwheel
```

### Buscar por URL e tipo
```bash
GET /cows?url=https://minhaloja.com/checkout&type=spinwheel
```

### Criar novo bloco
```bash
POST /cows
Content-Type: application/json

{
  "site": "minhaloja.com",
  "url": "https://minhaloja.com",
  "type": "spinwheel",
  "data": {
    "language": "pt-BR",
    "prizes": [...]
  }
}
```

### Atualizar bloco
```bash
PUT /cows/:id
Content-Type: application/json

{
  "site": "minhaloja.com",
  "url": "https://minhaloja.com",
  "type": "spinwheel",
  "data": {
    "language": "pt-BR",
    "prizes": [...]
  }
}
```

### Deletar bloco
```bash
DELETE /cows/:id
```

---

## Tipos Disponíveis

| Valor | Label | Ícone | Descrição |
|-------|-------|-------|-----------|
| `spinwheel` | Spin Wheel | 🎡 | Roleta de prêmios |
| `quiz` | Quiz | ❓ | Questionário interativo |
| `scratch` | Scratch Card | 🎫 | Raspadinha de prêmios |
| `countdown` | Countdown | ⏱️ | Contador regressivo |
| `gift` | Gift Box | 🎁 | Caixa de presente |

---

## Idiomas Suportados

| Código | Nome | Bandeira |
|--------|------|----------|
| `pt-BR` | Português (BR) | 🇧🇷 |
| `en-US` | English (US) | 🇺🇸 |
| `es-ES` | Español | 🇪🇸 |
| `fr-FR` | Français | 🇫🇷 |
| `de-DE` | Deutsch | 🇩🇪 |

---

## Validação

### Campos Obrigatórios
- ✅ `site` - Obrigatório
- ✅ `url` - Obrigatório
- ✅ `type` - Obrigatório
- ⚠️ `data` - Opcional, mas recomendado

### Campos Específicos por Tipo

**Spinwheel:**
- `data.prizes[]` - Array de prêmios
- Cada prêmio: `id`, `label`, `color`, `value`

**Quiz:**
- `data.questions[]` - Array de perguntas
- Cada pergunta: `id`, `question`, `options[]`, `correctAnswer`

**Scratch:**
- `data.prizes[]` - Array de prêmios
- Cada prêmio: `id`, `label`, `probability`, `image`

**Countdown:**
- `data.title`, `data.endDate`, `data.message`, `data.discount`, `data.code`

**Gift:**
- `data.title`, `data.description`, `data.prize`, `data.buttonText`, `data.image`
