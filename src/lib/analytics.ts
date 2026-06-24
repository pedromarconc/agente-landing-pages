// Instrumentação de analytics da landing (Microsoft Clarity + GA4).
// Todo evento é etiquetado com a variante (A/B) e com a atribuição de campanha
// (gclid/UTM), pra dar pra comparar o funil das duas variantes e ligar
// comportamento -> anúncio. Os IDs vêm de env vars; se não estiverem setados,
// cada ferramenta simplesmente não carrega (zero efeito).

import { VARIANT } from '../config/variant';

const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;
const GA4_ID = import.meta.env.VITE_GA4_ID;

const ATTR_KEY = 'kanglu_attr';
const ATTR_PARAMS = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function captureAttribution(): void {
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of ATTR_PARAMS) {
      const v = q.get(k);
      if (v) found[k] = v;
    }
    if (Object.keys(found).length > 0) {
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(found));
    }
  } catch {
    /* sessionStorage indisponível — segue sem atribuição */
  }
}

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function loadClarity(id: string): void {
  if (window.clarity) return;
  const stub = function (...args: unknown[]) {
    (stub.q = stub.q ?? []).push(args);
  } as ((...args: unknown[]) => void) & { q?: unknown[][] };
  window.clarity = stub;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.clarity.ms/tag/' + id;
  const first = document.getElementsByTagName('script')[0];
  first?.parentNode?.insertBefore(script, first);
}

let initialized = false;

export function initAnalytics(): void {
  if (initialized) return;
  initialized = true;

  captureAttribution();

  // GA4 reaproveita o gtag.js já carregado no index.html (o mesmo da conversão do Ads).
  if (GA4_ID) {
    window.gtag?.('set', { variant: VARIANT });
    window.gtag?.('config', GA4_ID);
  }

  // Microsoft Clarity (heatmaps + gravações de sessão).
  if (CLARITY_ID) {
    loadClarity(CLARITY_ID);
    window.clarity?.('set', 'variant', VARIANT);
    for (const [k, v] of Object.entries(getAttribution())) {
      window.clarity?.('set', k, v);
    }
  }
}

/** Dispara um evento de funil no GA4 (e marca no Clarity), sempre com variante + atribuição. */
export function track(event: string, params: Record<string, unknown> = {}): void {
  const payload = { variant: VARIANT, ...getAttribution(), ...params };
  try {
    window.gtag?.('event', event, payload);
  } catch {
    /* noop */
  }
  try {
    window.clarity?.('event', event);
  } catch {
    /* noop */
  }
}
