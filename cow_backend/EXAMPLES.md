# Exemplos de Dados para o Backend

Este documento contém exemplos de como popular o banco de dados com configurações de plugins.

## Inserir Configuração de Formulário

```bash
curl -X POST http://localhost:3000/cows \
  -H "Content-Type: application/json" \
  -d '{
    "site": "exemplo.com",
    "url": "https://exemplo.com",
    "type": "plugin",
    "data": {
      "type": "form",
      "questions": [
        {
          "id": 1,
          "title": "Pergunta 1",
          "question": "Você está gostando da sua experiência neste site?"
        },
        {
          "id": 2,
          "title": "Pergunta 2",
          "question": "Você recomendaria este site para seus amigos?"
        }
      ]
    }
  }'
```

## Inserir Configuração de Roleta

```bash
curl -X POST http://localhost:3000/cows \
  -H "Content-Type: application/json" \
  -d '{
    "site": "exemplo.com",
    "url": "https://exemplo.com",
    "type": "plugin",
    "data": {
      "type": "roulette",
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
        },
        {
          "id": 3,
          "label": "15% OFF",
          "color": "#FFE66D",
          "value": 15
        },
        {
          "id": 4,
          "label": "40% OFF",
          "color": "#95E1D3",
          "value": 40
        },
        {
          "id": 5,
          "label": "10% OFF",
          "color": "#F38181",
          "value": 10
        },
        {
          "id": 6,
          "label": "25% OFF",
          "color": "#AA96DA",
          "value": 25
        },
        {
          "id": 7,
          "label": "35% OFF",
          "color": "#FCBAD3",
          "value": 35
        },
        {
          "id": 8,
          "label": "50% OFF",
          "color": "#A8E6CF",
          "value": 50
        }
      ]
    }
  }'
```

## Buscar Configuração

```bash
# Buscar por URL e tipo
curl "http://localhost:3000/cows?url=https://exemplo.com&type=plugin"

# Buscar por site
curl "http://localhost:3000/cows?site=exemplo.com"

# Listar todas
curl "http://localhost:3000/cows"
```

## Script de População Inicial

Salve este script como `populate-db.sh`:

```bash
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
    "type": "plugin",
    "data": {
      "type": "form",
      "questions": [
        {
          "id": 1,
          "title": "Pergunta 1",
          "question": "Você está gostando da sua experiência neste site?"
        },
        {
          "id": 2,
          "title": "Pergunta 2",
          "question": "Você recomendaria este site para seus amigos?"
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
    "type": "plugin",
    "data": {
      "type": "roulette",
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
```

Execute com:

```bash
chmod +x populate-db.sh
./populate-db.sh
```

## Verificar Dados Inseridos

```bash
# Ver todos os registros
curl http://localhost:3000/cows | jq

# Ver apenas plugins do localhost
curl "http://localhost:3000/cows?site=localhost" | jq
```

## MongoDB Compass

Você também pode visualizar e editar os dados usando MongoDB Compass:

1. Conecte-se em: `mongodb://localhost:27017`
2. Database: `cow_platform` (ou o nome configurado)
3. Collection: `cows`

## Estrutura do Documento

```json
{
  "_id": "ObjectId",
  "site": "string",        // hostname do site
  "url": "string",         // URL completa
  "type": "string",        // tipo de configuração (ex: "plugin")
  "data": {
    "type": "form|roulette",  // tipo de componente
    "questions": [...],       // se type=form
    "prizes": [...]           // se type=roulette
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
