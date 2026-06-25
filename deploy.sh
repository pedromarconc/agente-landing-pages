#!/usr/bin/env bash
#
# deploy.sh — publica as DUAS variantes (A e B) da landing Kanglu no Vercel via CLI.
#
# Por que CLI: o GitHub está conectado a uma conta Vercel gratuita (sem env vars).
# Este script publica na conta Vercel PAGA sem depender da integração GitHub↔Vercel.
#
# A ÚNICA diferença entre A e B é o H1, escolhido em build-time pela env VITE_VARIANT.
# Aqui o VITE_VARIANT é injetado por deploy (--build-env), garantindo A→projeto A e B→projeto B.
#
# ── Pré-requisitos (uma vez) ────────────────────────────────────────────────
#   npm i -g vercel        # instala a CLI
#   vercel login           # entra na sua conta Vercel PAGA (escolha login por e-mail)
#
# ── Analytics (opcional, mesmos IDs nas duas variantes) ─────────────────────
#   cp .env.deploy.example .env.deploy   # e preencha VITE_CLARITY_ID / VITE_GA4_ID
#   Sem os IDs, o analytics fica desligado (no-op) — o site funciona normal.
#
# ── Uso ─────────────────────────────────────────────────────────────────────
#   ./deploy.sh            # publica A e B em produção
#
set -euo pipefail
cd "$(dirname "$0")"

# Projetos Vercel (um por variante). Ajuste os nomes aqui se quiser outros.
PROJECT_A="kanglu-landing"
PROJECT_B="kanglu-landing-b"

# Carrega IDs de analytics de .env.deploy (não versionado), se existir.
if [ -f .env.deploy ]; then
  set -a; . ./.env.deploy; set +a
fi
CLARITY_ID="${VITE_CLARITY_ID:-}"
GA4_ID="${VITE_GA4_ID:-}"

# Cria os projetos na conta logada (idempotente — ignora se já existirem).
vercel project add "$PROJECT_A" >/dev/null 2>&1 || true
vercel project add "$PROJECT_B" >/dev/null 2>&1 || true

deploy_variant() {
  local variant="$1" project="$2"
  local args=(deploy --prod --yes --project "$project" --build-env "VITE_VARIANT=${variant}")
  [ -n "$CLARITY_ID" ] && args+=(--build-env "VITE_CLARITY_ID=${CLARITY_ID}")
  [ -n "$GA4_ID" ]     && args+=(--build-env "VITE_GA4_ID=${GA4_ID}")

  echo ""
  echo "🚀 Variante ${variant}  →  projeto Vercel '${project}'"
  [ -z "${CLARITY_ID}${GA4_ID}" ] && echo "   (analytics OFF — defina VITE_CLARITY_ID/VITE_GA4_ID em .env.deploy p/ ligar)"
  vercel "${args[@]}"
}

echo "== Deploy Kanglu landing (A/B) na conta Vercel logada =="
deploy_variant A "$PROJECT_A"
deploy_variant B "$PROJECT_B"

echo ""
echo "✅ Pronto. Variantes A e B publicadas em produção."
echo "   Confira as URLs impressas acima (Production)."
