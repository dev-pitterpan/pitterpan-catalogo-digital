# Pitter Pan — Catálogo Digital

Projeto independente. Não depende do repositório do outro sistema.

## Executar

Node.js 24 ou superior.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Preencha o .env sem sobrescrever configurações existentes. Porta padrão: 3000.

## Verificar

`npm run typecheck`, `npm test`, `npm run build` e `npm run test:server`. Os testes HTTP utilizam dados fictícios e JSON locais.

## Publicar na Vercel

Importe este repositório com Root Directory na raiz (`./`), framework Next.js e Node 24. Configure as variáveis do .env.example nas configurações do projeto. Em produção, NEXT_PUBLIC_CATALOG_URL deve apontar para https://catalogopitterpanfesta.vercel.app. Nunca envie .env ou credenciais ao GitHub.

O catálogo não contém as rotas de login, gestão, vendas, cron ou webhooks. A integração com a Shopify é executada no servidor.

## Organização

Páginas e APIs em src/app. Componentes, regras e integrações utilizadas por esta aplicação em src/shared. Recursos em public e configurações em config. Scripts e testes pertencem a este projeto.
