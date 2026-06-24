import { useSearchParams } from 'react-router-dom';

export default function Obrigado() {
  const [searchParams] = useSearchParams();
  const nome = searchParams.get('nome')?.trim() || null;

  return (
    <div className="ob-root">
      <header className="ob-header">
        <a href="/" className="ob-logo">kanglu.</a>
      </header>

      <main className="ob-main">
        <div className="ob-content">
          <div className="ob-stamp">BRIEFING RECEBIDO</div>

          <h1 className="ob-title">
            Tudo certo{nome ? `, ${nome}` : ''}.
            <br />
            <em>A gente te chama no WhatsApp.</em>
          </h1>

          <p className="ob-deck">
            Um especialista da Kanglu vai te contatar em até 4 horas uteis.
            Enquanto isso, fica a vontade pra conversar agora.
          </p>

          <div className="ob-ctas">
            <a
              href="https://wa.me/5511999999999"
              className="ob-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir WhatsApp
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/" className="ob-btn-secondary">
              Voltar pro site
            </a>
          </div>

          <p className="ob-micro">Sem spam. Sem fidelidade.</p>
        </div>
      </main>

      <footer className="ob-footer">
        <span>© 2026 Kanglu</span>
        <span>kanglu.com.br</span>
      </footer>
    </div>
  );
}
