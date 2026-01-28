#!/bin/bash

API_URL="http://localhost:3000/cows"

echo "🌱 Populando banco de dados com exemplos..."

# Exemplo 1: Formulário com 2 perguntas
echo "📋 Inserindo configuração de formulário..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "site": "localhost",
    "url": "http://localhost:5173",
    "type": "quiz",
    "data": {
      "language": "pt-BR",
      "questions": [
        {
          "id": 1,
          "question": "Você está gostando da sua experiência neste site?",
          "options": ["Sim", "Não", "Talvez"],
          "correctAnswer": "Sim"
        },
        {
          "id": 2,
          "question": "Você recomendaria este site para seus amigos?",
          "options": ["Com certeza", "Provavelmente", "Não"],
          "correctAnswer": "Com certeza"
        }
      ]
    }
  }'

echo -e "\n"

# Exemplo 2: Roleta com 8 prêmios
echo "🎡 Inserindo configuração de roleta..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "site": "localhost",
    "url": "http://localhost:5173/roulette",
    "type": "spinwheel",
    "data": {
      "language": "pt-BR",
      "prizes": [
        {"id": 1, "label": "20% OFF", "color": "#FF6B6B", "value": 20},
        {"id": 2, "label": "30% OFF", "color": "#4ECDC4", "value": 30},
        {"id": 3, "label": "15% OFF", "color": "#FFE66D", "value": 15},
        {"id": 4, "label": "40% OFF", "color": "#95E1D3", "value": 40},
        {"id": 5, "label": "10% OFF", "color": "#F38181", "value": 10},
        {"id": 6, "label": "25% OFF", "color": "#AA96DA", "value": 25},
        {"id": 7, "label": "35% OFF", "color": "#FCBAD3", "value": 35},
        {"id": 8, "label": "50% OFF", "color": "#A8E6CF", "value": 50}
      ]
    }
  }'

echo -e "\n"
echo "✅ População concluída!"
echo ""
echo "Para verificar os dados inseridos, execute:"
echo "  curl http://localhost:3000/cows | jq"
