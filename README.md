# Atividade 02 — API de data e hora

Nome do projeto no GitHub: `atividade-02-data-hora-api`.

API REST criada com Express para retornar a data e a hora atuais no fuso
`America/Sao_Paulo`.

Deploy ativo: [https://atividade-02-data-hora-api.vercel.app](https://atividade-02-data-hora-api.vercel.app)

## Executar localmente

Requisitos: Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

## Rotas

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Apresenta informações básicas da API. |
| `GET` | `/api/data-hora` | Retorna a data, a hora, o instante ISO e o fuso horário. |
| `GET` | `/api/saude` | Verificação de saúde usada pelo Render. |

Exemplo de resposta de `GET /api/data-hora`:

```json
{
  "data": "02/09/2026",
  "hora": "12:34:56",
  "dataHora": "2026-09-02T15:34:56.000Z",
  "fusoHorario": "America/Sao_Paulo"
}
```

## Testes

```bash
npm test
npm run check
```

## Deploy no Render

> **Nota:** A API também está deployada no Vercel. O deploy no Render é uma alternativa.

1. Publique este diretório em um repositório próprio no GitHub.
2. No Render, escolha **New > Blueprint** e conecte o repositório.
3. O arquivo `render.yaml` preencherá os comandos de build e inicialização.
4. Informe em `CORS_ORIGIN` a URL pública do frontend na Vercel.
5. Cadastre a URL gerada pelo Render como `VITE_API_URL` no frontend.

## Variáveis de ambiente

| Variável | Valor padrão | Uso |
| --- | --- | --- |
| `PORT` | `3000` | Porta local; o Render fornece esse valor automaticamente. |
| `TIMEZONE` | `America/Sao_Paulo` | Fuso usado para formatar data e hora. |
| `CORS_ORIGIN` | `*` | Origem autorizada a consumir a API. |
