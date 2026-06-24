/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Variante do teste A/B. 'A' = kanglu-landing, 'B' = kanglu-landing-b. Default: 'A'. */
  readonly VITE_VARIANT?: string;
}

interface Window {
  gtag_report_conversion?: (url?: string) => boolean;
}
