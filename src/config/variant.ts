// Conteúdo específico de cada variante do teste A/B.
// A variante é escolhida em BUILD-TIME pela env VITE_VARIANT (setada por projeto na Vercel):
//   - VITE_VARIANT=A  -> kanglu-landing      (kanglu-landing.vercel.app)
//   - VITE_VARIANT=B  -> kanglu-landing-b    (kanglu-landing-b.vercel.app)
// A ÚNICA diferença entre A e B é o H1 da hero — todo o resto da landing é idêntico.

export type VariantKey = 'A' | 'B';

interface VariantContent {
  /** Primeira linha do H1 (texto normal). */
  heroTitleLine1: string;
  /** Segunda linha do H1 (destaque laranja, classe .highlight). */
  heroTitleHighlight: string;
}

const VARIANTS: Record<VariantKey, VariantContent> = {
  A: {
    heroTitleLine1: 'Seu cliente quer saber onde está o pedido.',
    heroTitleHighlight: 'A Kanglu responde antes.',
  },
  B: {
    heroTitleLine1: 'Cadê meu pedido?',
    heroTitleHighlight: 'A Kanglu responde antes do cliente perguntar.',
  },
};

const raw = (import.meta.env.VITE_VARIANT ?? 'A').toString().trim().toUpperCase();

/** Variante ativa neste build. Qualquer valor diferente de 'B' cai em 'A' (default seguro). */
export const VARIANT: VariantKey = raw === 'B' ? 'B' : 'A';

export const content: VariantContent = VARIANTS[VARIANT];
