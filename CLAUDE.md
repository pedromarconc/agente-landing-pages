# CLAUDE.md — Kanglu Landing Pages

Guia do repositório para agentes e devs. Mantenha atualizado quando o comportamento mudar.

## O que é
Landing page da **Kanglu** (SaaS de pós-venda para e-commerce: rastreio proativo, trocas
automatizadas, auditoria de frete). Roda **2 variantes A/B** do mesmo código, diferenciadas
só pelo H1, para teste de mensagem em campanhas de Google Ads. Objetivo: **CRO** com
**rastreamento de conversão limpo** e **leitura de comportamento** (analytics).

## Stack
- **Vite 5 + React 18 + TypeScript + Tailwind 3**
- **React Router 7** (`/` = landing, `/obrigado` = pós-envio)
- **Supabase** (captura de lead via Edge Function)
- **Vercel** (hospedagem; deploy por git)

## Variantes A/B (`VITE_VARIANT`)
Um repo, dois projetos Vercel, escolhidos em build-time pela env **`VITE_VARIANT`**:

| Variante | env | Projeto Vercel | URL | H1 |
|---|---|---|---|---|
| A | `VITE_VARIANT=A` (default) | kanglu-landing | kanglu-landing.vercel.app | "Seu cliente quer saber onde está o pedido. **A Kanglu responde antes.**" |
| B | `VITE_VARIANT=B` | kanglu-landing-b | kanglu-landing-b.vercel.app | "Cadê meu pedido? **A Kanglu responde antes do cliente perguntar.**" |

- **A ÚNICA diferença entre A e B é o H1.** Todo o resto é idêntico.
- Conteúdo da variante: `src/config/variant.ts`. Valor ausente/inválido → cai em **A** (default seguro).

## Conversão (Google Ads) — REGRA CRÍTICA
- Conversion ID/label: **`AW-18210492584/NVXpCLCIwLgcEKihuOtD`** (igual nas duas variantes). gtag em `index.html`.
- **A conversão dispara UMA vez, no mount de `/obrigado`** (`src/pages/Obrigado.tsx`) — só depois do lead enviado.
- ⚠️ **Não mova nem duplique esse disparo sem alinhamento.** (Antes disparava ao abrir o modal e no submit, inflando o número — corrigido.)
- `/obrigado` sempre carrega via `vercel.json` (rewrite SPA).

## Analytics / leitura de comportamento
- Módulo: `src/lib/analytics.ts`. **Microsoft Clarity** (heatmaps + gravações) + **GA4** (funil).
- Ativados por env (`VITE_CLARITY_ID`, `VITE_GA4_ID`); **sem env = no-op** (nem carrega).
- Todo evento sai **etiquetado com a variante (A/B)** e com **atribuição (gclid/utm_*)** capturada da URL.
- Eventos: `lp_view`, `section_view` (scroll-depth), `cta_demo_click`, `form_start`,
  `lead_submit` / `lead_submit_error`, `thankyou_view`, `whatsapp_click`.

## Lead pipeline
- Form (modal) → `submitDemoLead()` (`src/lib/supabase.ts`) → Edge Function `submit-demo-lead` → tabela `demo_leads`.
- A **anon key** do Supabase fica no client (pública por design). A **service_role key** fica nos secrets do Supabase (NÃO no código).

## Env vars (setar por projeto na Vercel)
| Var | Valor | Onde |
|---|---|---|
| `VITE_VARIANT` | `A` / `B` | `A` no kanglu-landing, `B` no kanglu-landing-b |
| `VITE_CLARITY_ID` | id do projeto Clarity | mesmo nos dois |
| `VITE_GA4_ID` | `G-XXXXXXX` | mesmo nos dois |

## Comandos
```bash
npm run dev        # dev local
npm run build      # build de produção (usa VITE_VARIANT; default A)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```
Build de uma variante: `VITE_VARIANT=B npm run build`.

## Deploy
- **Publicação via GitHub Actions → conta Vercel PAGA** — ver **`DEPLOY.md`**.
  Motivo: o GitHub está conectado a uma conta Vercel **gratuita** (não cria env vars);
  a conta **paga** tem env vars mas não está conectada ao GitHub. GitHub Actions usa um
  **token** da conta paga para deployar direto, sem conflito e sem mexer na integração existente.
- Workflow: `.github/workflows/deploy.yml` — push na `main` publica os 2 projetos
  (`kanglu-landing` A, `kanglu-landing-b` B), injetando `VITE_VARIANT` por variante.
- Secrets necessários no GitHub: `VERCEL_TOKEN` (obrigatório), `VITE_CLARITY_ID` e `VITE_GA4_ID` (opcionais).
- Produção = branch **`main`** (já criada). Trabalho na branch `claude/focused-davinci-f0uxhd`.
  **Go-live / mudanças em produção só com aprovação.**

## Guardrails
1. Não alterar o disparo de conversão sem OK explícito.
2. Não publicar em `main` (produção) sem aprovação.
3. A conversão divide o ID com o **agente de Ads**; mudanças que afetem volume de conversão precisam ser comunicadas a ele.

## Backlog / pendências conhecidas
- [ ] CTA final "Quero minha demo gratuita" tem `href="#"` (não abre o modal) — corrigir.
- [ ] Repo está **público** → tornar **privado**.
- [ ] Fase 2: salvar gclid/UTM junto do lead no Supabase (migration + edge function) p/ fechar anúncio→lead.
- [ ] Opcional: disparar conversão só quando `/obrigado` vier de envio real (anti acesso direto/bot).
- [ ] Lint: 1 erro pré-existente (`catch` sem uso em App.tsx) — limpeza.
