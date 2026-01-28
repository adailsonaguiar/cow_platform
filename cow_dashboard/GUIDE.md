# 🎯 Guia Rápido - COW Dashboard

## Como Criar Blocos Interativos

### 1. Spin Wheel (Roleta) 🎡

Quando selecionar **Spin Wheel**, você poderá:

- **Adicionar múltiplos prêmios** - Cada prêmio tem:
  - Label (Ex: "20% OFF")
  - Cor (picker de cor + código hex)
  - Valor numérico

**Exemplo de uso:**
- Label: "30% OFF" | Cor: #4ECDC4 | Valor: 30
- Label: "50% OFF" | Cor: #FF6B6B | Valor: 50

**JSON gerado automaticamente:**
```json
{
  "type": "spinwheel",
  "language": "pt-BR",
  "data": {
    "language": "pt-BR",
    "prizes": [
      {"id": 1, "label": "20% OFF", "color": "#FF6B6B", "value": 20},
      {"id": 2, "label": "30% OFF", "color": "#4ECDC4", "value": 30}
    ]
  }
}
```

---

### 2. Quiz (Questionário) ❓

Quando selecionar **Quiz**, você poderá:

- **Adicionar múltiplas perguntas**
- Cada pergunta tem:
  - Pergunta completa
  - Múltiplas opções de resposta
  - Resposta correta (opcional)

**Exemplo de uso:**
- Pergunta: "Qual recurso você mais gosta?"
- Opções: ["Preço", "Qualidade", "Atendimento"]
- Resposta correta: "Qualidade"

**JSON gerado automaticamente:**
```json
{
  "type": "quiz",
  "language": "pt-BR",
  "data": {
    "language": "pt-BR",
    "questions": [
      {
        "id": 1,
        "question": "Qual recurso você mais gosta?",
        "options": ["Preço", "Qualidade", "Atendimento"],
        "correctAnswer": "Qualidade"
      }
    ]
  }
}
```

---

### 3. Scratch Card (Raspadinha) 🎫

Quando selecionar **Scratch Card**, você poderá:

- **Adicionar prêmios ocultos**
- Cada prêmio tem:
  - Label (texto do prêmio)
  - Probabilidade (0-100%)
  - URL da imagem (opcional)

**Exemplo de uso:**
- Label: "R$ 50 de desconto" | Probabilidade: 15% | Imagem: url
- Label: "Frete grátis" | Probabilidade: 30% | Imagem: url

**JSON gerado automaticamente:**
```json
{
  "type": "scratch",
  "language": "pt-BR",
  "data": {
    "language": "pt-BR",
    "prizes": [
      {"id": 1, "label": "R$ 50 OFF", "probability": 15, "image": "..."},
      {"id": 2, "label": "Frete grátis", "probability": 30, "image": "..."}
    ]
  }
}
```

---

### 4. Countdown (Contador) ⏱️

Quando selecionar **Countdown**, você poderá configurar:

- Título da oferta
- Data e hora de término
- Mensagem ao expirar
- Percentual de desconto
- Código de cupom

**Exemplo de uso:**
- Título: "Oferta Black Friday"
- Data: 2026-11-29 23:59
- Desconto: 40%
- Código: "BLACK40"

**JSON gerado automaticamente:**
```json
{
  "type": "countdown",
  "language": "pt-BR",
  "data": {
    "language": "pt-BR",
    "title": "Oferta Black Friday",
    "endDate": "2026-11-29T23:59",
    "message": "Oferta expirada",
    "discount": 40,
    "code": "BLACK40"
  }
}
```

---

### 5. Gift Box (Presente) 🎁

Quando selecionar **Gift Box**, você poderá configurar:

- Título do presente
- Descrição
- Prêmio revelado
- Texto do botão
- Imagem opcional

**Exemplo de uso:**
- Título: "Você ganhou!"
- Descrição: "Um presente especial para você"
- Prêmio: "25% de desconto"
- Botão: "Abrir Presente"

**JSON gerado automaticamente:**
```json
{
  "type": "gift",
  "language": "pt-BR",
  "data": {
    "language": "pt-BR",
    "title": "Você ganhou!",
    "description": "Um presente especial para você",
    "prize": "25% de desconto",
    "buttonText": "Abrir Presente",
    "image": "https://..."
  }
}
```

---

## 📋 Campos Obrigatórios

Para **todos** os tipos de bloco:

1. ✅ **Formato do Bloco** - Escolha o tipo
2. ✅ **Nome do Site** - Identificador único
3. ✅ **URL da Página** - Onde o bloco será exibido
4. ✅ **Idioma** - Idioma da interface

---

## 🎨 Dicas de Design

### Cores para Spin Wheel
Use cores vibrantes e contrastantes:
- `#FF6B6B` - Vermelho coral
- `#4ECDC4` - Turquesa
- `#FFE66D` - Amarelo suave
- `#95E1D3` - Menta
- `#AA96DA` - Roxo suave

### Probabilidades para Scratch
Total deve somar ~100%:
- Prêmios comuns: 40-50%
- Prêmios médios: 30-40%
- Prêmios raros: 10-20%

---

## 🔄 Funcionalidades

- **Criar** - Clique em "Novo Bloco"
- **Editar** - Menu de 3 pontos no card → Editar
- **Duplicar** - Menu → Duplicar (cria cópia)
- **Excluir** - Menu → Excluir (confirmação)
- **Buscar** - Digite site ou URL
- **Filtrar** - Selecione tipo de bloco

---

## ⚡ Exemplos Práticos

### E-commerce com Desconto
```
Tipo: Spin Wheel
Site: minhalojavirtual.com
URL: https://minhalojavirtual.com/checkout
Prêmios: 10%, 15%, 20%, 25%, 30% OFF
```

### Formulário de Feedback
```
Tipo: Quiz
Site: meusite.com
URL: https://meusite.com/feedback
Perguntas: 3-5 perguntas sobre experiência
```

### Promoção Relâmpago
```
Tipo: Countdown
Site: ofertas.com
URL: https://ofertas.com/promo
Término: 24 horas
Desconto: 50%
```

---

## 🚀 Próximos Passos

Após criar o bloco no dashboard:

1. O bloco é salvo no backend (MongoDB)
2. Use a API para buscar: `GET /cows?url=...&type=...`
3. Integre com o plugin frontend
4. O plugin renderiza o bloco na página

---

## 📞 Suporte

Se precisar de ajuda:
- Verifique se o backend está rodando (porta 3000)
- Verifique se o MongoDB está ativo
- Consulte os logs do navegador (F12)
