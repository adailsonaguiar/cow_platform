# MongoDB Setup

## Iniciar o MongoDB

Para subir o container MongoDB, execute:

```bash
docker-compose up -d
```

## Parar o MongoDB

```bash
docker-compose down
```

## Instalar Dependências

Antes de rodar o projeto, instale as novas dependências:

```bash
npm install
```

## Estrutura do Banco

- **Database**: cow_platform
- **Collection**: cows
- **Credenciais**: 
  - Username: admin
  - Password: admin123
  - Port: 27017

## Campos da Entidade Cow

- `site` (string, obrigatório): Nome do site
- `url` (string, obrigatório): URL da cow
- `type` (string, obrigatório): Tipo da cow
- `data` (object, opcional): Dados adicionais em formato JSON

## Repository Disponível

O `CowRepository` oferece os seguintes métodos:
- `create(cowData)`: Criar uma nova cow
- `findAll()`: Buscar todas as cows
- `findById(id)`: Buscar cow por ID
- `findBySite(site)`: Buscar cows por site
- `findByType(type)`: Buscar cows por tipo
- `update(id, cowData)`: Atualizar uma cow
- `delete(id)`: Deletar uma cow
- `deleteAll()`: Deletar todas as cows
