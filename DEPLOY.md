# Deploy — Kanglu Landing (Vercel CLI)

Publicação das duas variantes (A/B) na conta **Vercel paga**, via CLI.

> **Por quê CLI?** O GitHub está conectado a uma conta Vercel gratuita (que não cria
> env vars). A conta paga cria env vars mas não está conectada ao GitHub. A CLI publica
> direto na conta paga, sem depender dessa integração.

## Pré-requisitos (uma vez)

```bash
npm i -g vercel     # instala a CLI
vercel login        # entre na sua conta Vercel PAGA (escolha "Continue with Email")
```

## Analytics (opcional)

Os IDs do Clarity e GA4 são os **mesmos** nas duas variantes. Para ligar:

```bash
cp .env.deploy.example .env.deploy
# edite .env.deploy e preencha VITE_CLARITY_ID e VITE_GA4_ID
```

Sem esses IDs o site funciona normal — só o analytics fica desligado (no-op).

## Publicar

```bash
./deploy.sh
```

O script:
1. cria os projetos `kanglu-landing` (A) e `kanglu-landing-b` (B) na conta logada — idempotente;
2. faz **build de produção** de cada variante injetando `VITE_VARIANT` (A/B) via `--build-env`;
3. publica em produção e imprime as URLs.

> ⚠️ **Go-live de conversão:** o site dispara a conversão do Google Ads
> (`AW-18210492584/...`) no `/obrigado`. Avise o agente de Ads quando publicar —
> o volume de conversões passa a contar de verdade.

## Conferir após o deploy

- URL do projeto A → H1 deve ser **"Seu cliente quer saber onde está o pedido. A Kanglu responde antes."**
- URL do projeto B → H1 deve ser **"Cadê meu pedido? A Kanglu responde antes do cliente perguntar."**
- Preencher o formulário → deve cair no Supabase e abrir `/obrigado`.

## Domínio próprio (quando quiser)

No painel da Vercel paga → projeto → **Settings → Domains** → adicione o domínio e
aponte o DNS conforme as instruções da Vercel.
