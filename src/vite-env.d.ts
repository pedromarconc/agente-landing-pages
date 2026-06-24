/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Variante do teste A/B. 'A' = kanglu-landing, 'B' = kanglu-landing-b. Default: 'A'. */
  readonly VITE_VARIANT?: string;
  /** ID do projeto no Microsoft Clarity (heatmaps + gravações). Se vazio, Clarity não carrega. */
  readonly VITE_CLARITY_ID?: string;
  /** Measurement ID do GA4 (ex.: G-XXXXXXX). Se vazio, eventos GA4 não são enviados. */
  readonly VITE_GA4_ID?: string;
}

interface Window {
  gtag_report_conversion?: (url?: string) => boolean;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  clarity?: (...args: unknown[]) => void;
}
