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

## Importar a configuração do projeto anterior

Na pasta deste projeto, execute:

```powershell
npm run env:import -- --from "C:\Projetos\bruno\pitterpanfestas-catalogo\.env"
```

A importação lê o arquivo somente no computador, copia apenas as variáveis do modelo desta aplicação e preenche os valores ausentes. Preserva valores já preenchidos no novo `.env`, cria backup antes de alterá-lo e não imprime credenciais. O catálogo não recebe credenciais de vendas ou autenticação da gestão. As portas padrão ficam 3000 para catálogo e 3001 para gestão.

A validação é local e não consulta a Shopify. A gestão requer banco PostgreSQL, credenciais próprias de vendas e configuração de login. `JITSI_BASE_URL` e `CRON_SECRET` são opcionais para os respectivos recursos. Não compartilhe o conteúdo do `.env`. Arquivos `.env.local` e outros arquivos específicos de ambiente podem prevalecer sobre `.env` e são sinalizados.

Na Vercel, configure as mesmas variáveis de servidor no projeto correspondente e use `NEXT_PUBLIC_CATALOG_URL=https://catalogopitterpanfesta.vercel.app` em produção. Não publique o `.env` no GitHub.
