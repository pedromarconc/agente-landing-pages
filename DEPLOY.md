# Deploy — Kanglu Landing (GitHub Actions → Vercel pago)

As duas variantes (A/B) são publicadas na conta **Vercel paga** via GitHub Actions.

> **Por quê assim?** O GitHub está conectado a uma conta Vercel **gratuita** (sem env vars).
> A conta **paga** tem env vars mas não está conectada ao GitHub.
> O GitHub Actions usa um **token** da conta paga para deployar direto — sem conflito,
> sem mexer na integração GitHub↔Vercel gratuita.

## Como funciona

- Push na branch **`main`** → `.github/workflows/deploy.yml` roda automaticamente.
- O workflow publica os projetos `kanglu-landing` (variante A) e `kanglu-landing-b` (variante B)
  na conta paga, injetando `VITE_VARIANT` por variante no build.

## Setup (uma vez)

### 1. Gere o token no Vercel pago

Conta Vercel paga → **Settings → Tokens** → **Create Token**
- Scope: Full Account (ou o time onde vão ficar os projetos)
- Anote o valor — aparece uma só vez.

### 2. Adicione os secrets no GitHub

No repo `pedromarconc/agente-landing-pages` →
**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valor | Obrigatório? |
|--------|-------|-------------|
| `VERCEL_TOKEN` | token gerado no passo 1 | ✅ Sim |
| `VITE_CLARITY_ID` | ID do projeto no Microsoft Clarity | Não (analytics off sem ele) |
| `VITE_GA4_ID` | `G-XXXXXXXXXX` do GA4 | Não (analytics off sem ele) |

> Analytics IDs vazios = no-op (o site funciona normal, só sem heatmaps/funil).
> Dá pra adicionar depois e o próximo deploy já liga.

### 3. Pronto — o próximo push na `main` deploya automaticamente

Acompanhe em: GitHub → repo → **Actions** → workflow "Deploy to Vercel (paid account)"

## Primeiro deploy manual (se quiser subir sem esperar um push)

```bash
# No seu computador, na raiz do projeto:
npm i -g vercel
vercel login   # entre na conta PAGA (escolha "Continue with Email")
./deploy.sh    # publica A e B na conta logada
```

> `deploy.sh` está no repo como alternativa para deploys manuais pontuais.
> Ele também carrega `VITE_CLARITY_ID`/`VITE_GA4_ID` de um arquivo local `.env.deploy`
> (copie de `.env.deploy.example` e preencha).

## Conferir após o deploy

- URL do projeto A → H1: **"Seu cliente quer saber onde está o pedido. A Kanglu responde antes."**
- URL do projeto B → H1: **"Cadê meu pedido? A Kanglu responde antes do cliente perguntar."**
- Preencher o formulário → lead deve aparecer no Supabase e abrir `/obrigado`.

## Domínio próprio

No painel da Vercel paga → projeto → **Settings → Domains** → adicione o domínio
e aponte o DNS conforme as instruções da Vercel.

## ⚠️ Aviso de go-live

Quando a primeira publicação entrar no ar, o `/obrigado` passa a disparar a conversão
do Google Ads (`AW-18210492584/...`) de verdade.
**Avise o agente de Ads** — vocês dividem o mesmo Conversion ID.
