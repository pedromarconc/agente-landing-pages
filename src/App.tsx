import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inject } from '@vercel/analytics';
import { submitDemoLead } from './lib/supabase';
import { content } from './config/variant';

export default function App() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    contact: '',
    monthlyOrders: '',
    source: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    try { inject({ debug: false }); } catch (_) {}

    const nav = document.getElementById('nav');
    const handleScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

    // Demo modal handlers
    const demoLinks = document.querySelectorAll('a[href="#demo"]');
    demoLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        setIsModalOpen(true);
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitDemoLead({
        name: formData.name,
        brand_name: formData.brandName,
        contact: formData.contact,
        monthly_orders: formData.monthlyOrders,
        source: formData.source,
      });
      navigate(`/obrigado?nome=${encodeURIComponent(formData.name.trim())}`);
    } catch {
      setSubmitError('Algo deu errado. Tente novamente ou entre em contato pelo WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmitSuccess(false);
    setSubmitError('');
    setFormData({ name: '', brandName: '', contact: '', monthlyOrders: '', source: '' });
  };

  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <div className="container">
          <a href="#" className="nav-logo">kanglu.</a>
          <ul className="nav-links">
            <li><a href="#problema">O problema</a></li>
            <li><a href="#solucao">Solução</a></li>
            <li><a href="#como">Como funciona</a></li>
            <li><a href="#demo" className="btn-primary btn-sm">Quero uma demo →</a></li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-content fade-up">
            <div className="hero-eyebrow"><span></span> Pós-venda para e-commerce</div>
            <h1>
              {content.heroTitleLine1}<br />
              <span className="highlight">{content.heroTitleHighlight}</span>
            </h1>
            <p className="hero-sub">
              Rastreio proativo, trocas automatizadas e auditoria de frete, tudo integrado à sua loja, sem código, sem planilha, sem atendimento manual.
            </p>
            <div className="hero-ctas">
              <a href="#demo" className="btn-primary">Quero ver uma demo →</a>
              <a href="#como" className="btn-secondary">Como funciona ↓</a>
            </div>
            <div className="hero-proof">
              <div className="hero-proof-item">
                <span className="hero-proof-number">+2.400</span>
                <span className="hero-proof-label">pedidos rastreados/dia</span>
              </div>
              <div className="hero-proof-divider"></div>
              <div className="hero-proof-item">
                <span className="hero-proof-number">94%</span>
                <span className="hero-proof-label">redução em tickets</span>
              </div>
              <div className="hero-proof-divider"></div>
              <div className="hero-proof-item">
                <span className="hero-proof-number">R$ 48k</span>
                <span className="hero-proof-label">recuperados em cobranças</span>
              </div>
            </div>
          </div>

          <div className="hero-visual fade-up" style={{ transitionDelay: '0.15s' }}>
            <div className="hero-mockup">
              <div className="mockup-header">
                <div className="mockup-dot" style={{ background: '#FF6B6B' }}></div>
                <div className="mockup-dot" style={{ background: '#FFD93D' }}></div>
                <div className="mockup-dot" style={{ background: '#6BCB77' }}></div>
              </div>
              <div className="mockup-notification">
                <div className="notif-icon orange">📦</div>
                <div className="notif-content">
                  <h4>Pedido #48291 · Em trânsito</h4>
                  <p>Notificação enviada para maria@email.com via WhatsApp</p>
                </div>
                <span className="notif-time">agora</span>
              </div>
              <div className="mockup-notification">
                <div className="notif-icon green">✓</div>
                <div className="notif-content">
                  <h4>Troca #1087 · Coleta acionada</h4>
                  <p>Transportadora confirmou retirada para amanhã 09h–12h</p>
                </div>
                <span className="notif-time">2 min</span>
              </div>
              <div className="mockup-notification">
                <div className="notif-icon bordo">💰</div>
                <div className="notif-content">
                  <h4>Auditoria · R$ 1.240 recuperados</h4>
                  <p>3 cobranças indevidas identificadas na fatura de maio</p>
                </div>
                <span className="notif-time">5 min</span>
              </div>
              <div className="mockup-floating">
                <div className="floating-check">✓</div>
                <div className="floating-text">
                  Zero tickets abertos
                  <span>Últimas 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section className="pain-section" id="problema">
        <div className="container">
          <div className="section-label fade-up">Você está aqui</div>
          <h2 className="fade-up">Quanto mais você cresce, mais o pós‑venda dói.</h2>
          <div className="pain-cards">
            <div className="pain-card fade-up">
              <div className="pain-icon">🔍</div>
              <h3>Rastreio reativo</h3>
              <p>O cliente não sabe onde está o pedido. Ele abre ticket. Você responde na mão. Isso acontece centenas de vezes por mês, e piora a cada novo pedido.</p>
            </div>
            <div className="pain-card fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="pain-icon">🔄</div>
              <h3>Troca quebrada</h3>
              <p>Sua operação de troca vive no WhatsApp e na planilha. Sem fluxo, sem rastreabilidade. O cliente desiste no meio, pede chargeback, e nunca mais volta.</p>
            </div>
            <div className="pain-card fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="pain-icon">💸</div>
              <h3>Frete cobrado errado</h3>
              <p>Sua transportadora cobra por peso e dimensão que não batem com o pedido real. Sem cruzamento automático, você simplesmente paga, e nunca descobre.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION */}
      <section className="transition-section">
        <div className="container">
          <div className="transition-block fade-up">
            <p>
              A Kanglu não nasceu numa startup de garagem. Foi construída{' '}
              <strong>dentro de uma operação logística real</strong>, por quem já viveu esse problema do lado de dentro.
            </p>
          </div>
        </div>
      </section>

      {/* ENVIAGORA CREDIBILITY */}
      <section className="enviagora-section">
        <div className="container">
          <div className="enviagora-card fade-up">
            <div className="enviagora-left">
              <div className="enviagora-logos">
                <span className="env-logo">envi<span>a</span>gora</span>
                <span className="env-x">×</span>
                <span className="kang-logo">kanglu.</span>
              </div>
              <h2 className="enviagora-headline">
                Os fundadores da Enviagora,{' '}
                <span className="env-highlight">Logística #1<br />do TikTok Shop</span>{' '}
                , estão por trás da{' '}
                <span className="kang-highlight">Kanglu.</span>
              </h2>
              <p className="enviagora-sub">
                A mesma confiança que as maiores marcas já depositam na Enviagora para enviar seus pedidos, agora garante que{' '}
                <strong>seus clientes tenham transparência total do rastreio à troca.</strong>
              </p>
            </div>
            <div className="enviagora-right">
              <div className="env-badge-top">
                <span className="env-rank">#1</span>
                <span><strong>Logística #1</strong> do TikTok Shop no Brasil</span>
              </div>
              <div className="env-stats-grid">
                <div className="env-stat">
                  <span className="env-stat-num">99.6%</span>
                  <span className="env-stat-label">Assertividade nos pedidos</span>
                </div>
                <div className="env-stat">
                  <span className="env-stat-num">92%</span>
                  <span className="env-stat-label">Enviados em até 24h</span>
                </div>
                <div className="env-stat">
                  <span className="env-stat-num">+150</span>
                  <span className="env-stat-label">Pessoas na operação</span>
                </div>
                <div className="env-stat">
                  <span className="env-stat-num">3</span>
                  <span className="env-stat-label">Centros de distribuição</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="solution-section" id="solucao">
        <div className="container">
          <div className="solution-header fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>A solução</div>
            <h2>O pós‑venda que grandes marcas têm, agora acessível para qualquer e‑commerce.</h2>
          </div>

          {/* Rastreio */}
          <div className="solution-item fade-up">
            <div>
              <div className="solution-number">01</div>
              <div className="solution-tag">Rastreio</div>
              <h3>Rastreio Proativo</h3>
              <div className="subtitle">O cliente sabe de tudo. Antes de perguntar.</div>
              <p>Notificações automáticas por e-mail e WhatsApp a cada etapa da entrega. A marca fala primeiro. O ticket nunca chega.</p>
            </div>
            <div className="solution-visual sv-tracking">
              <div className="tracking-timeline">
                <div className="timeline-step">
                  <div className="timeline-dot active">📦</div>
                  <div className="timeline-info">
                    <h5>Pedido confirmado</h5>
                    <span>Hoje, 14:32 · WhatsApp enviado ✓</span>
                  </div>
                </div>
                <div className="timeline-step">
                  <div className="timeline-dot active">🚚</div>
                  <div className="timeline-info">
                    <h5>Em trânsito</h5>
                    <span>Hoje, 16:10 · E-mail enviado ✓</span>
                  </div>
                </div>
                <div className="timeline-step">
                  <div className="timeline-dot active">📍</div>
                  <div className="timeline-info">
                    <h5>Saiu para entrega</h5>
                    <span>Amanhã, 08:00 · WhatsApp agendado</span>
                  </div>
                </div>
                <div className="timeline-step">
                  <div className="timeline-dot pending">✓</div>
                  <div className="timeline-info">
                    <h5>Entregue</h5>
                    <span>Aguardando</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trocas */}
          <div className="solution-item fade-up">
            <div>
              <div className="solution-number">02</div>
              <div className="solution-tag">Trocas</div>
              <h3>Trocas e Devoluções Automatizadas</h3>
              <div className="subtitle">Zero intervenção manual. Do pedido à coleta.</div>
              <p>O cliente abre a solicitação, recebe as instruções, a coleta é acionada e o status atualiza em tempo real. Sua equipe não precisa fazer nada.</p>
            </div>
            <div className="solution-visual sv-exchange">
              <div className="exchange-flow">
                {[
                  ['1', 'Cliente solicita troca', '✓ Self-service'],
                  ['2', 'Instruções enviadas', '✓ Automático'],
                  ['3', 'Coleta acionada', '✓ Automático'],
                  ['4', 'Produto recebido', '✓ Rastreado'],
                  ['5', 'Novo envio ou reembolso', '✓ Automático'],
                ].map(([num, label, badge]) => (
                  <div className="flow-step" key={num}>
                    <div className="flow-step-num">{num}</div>
                    <span>{label}</span>
                    <span className="auto-badge">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auditoria */}
          <div className="solution-item fade-up">
            <div>
              <div className="solution-number">03</div>
              <div className="solution-tag">Auditoria</div>
              <h3>Auditoria de Fatura de Frete</h3>
              <div className="subtitle">Para de pagar o que não deve.</div>
              <p>Cruzamento automático entre o que foi cobrado e o que foi entregue. Cobranças indevidas são identificadas e recuperadas, sem planilha.</p>
            </div>
            <div className="solution-visual sv-audit">
              <div className="audit-card">
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--bordo)', marginBottom: '18px' }}>
                  Fatura Maio · Transportadora X
                </div>
                <div className="audit-row">
                  <span className="audit-label">Cobrado</span>
                  <span className="audit-val cobrado">R$ 12.480,00</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Valor real verificado</span>
                  <span className="audit-val real">R$ 11.240,00</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Divergências encontradas</span>
                  <span className="audit-val cobrado">7 itens</span>
                </div>
                <div className="audit-total">
                  <span>💰 Recuperado automaticamente</span>
                  <span>R$ 1.240</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard */}
          <div className="solution-item fade-up">
            <div>
              <div className="solution-number">04</div>
              <div className="solution-tag">Gestão</div>
              <h3>Gestão Centralizada de Frete</h3>
              <div className="subtitle">Todos os seus carriers num só lugar.</div>
              <p>Dashboard para contratar, comparar e gerenciar tarifas. Decisão mais rápida, custo mais baixo.</p>
            </div>
            <div className="solution-visual sv-dashboard">
              <div className="dash-preview">
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.82rem', color: 'var(--bordo)', marginBottom: '18px' }}>
                  Comparativo de tarifas · Maio
                </div>
                <div className="dash-bar-group">
                  <div className="dash-bar" style={{ height: '75%', background: 'var(--gradient-orange)' }} data-label="Carrier A"></div>
                  <div className="dash-bar" style={{ height: '90%', background: 'var(--nude)' }} data-label="Carrier B"></div>
                  <div className="dash-bar" style={{ height: '60%', background: 'var(--gradient-orange)' }} data-label="Carrier C"></div>
                  <div className="dash-bar" style={{ height: '100%', background: 'var(--nude)' }} data-label="Carrier D"></div>
                  <div className="dash-bar" style={{ height: '45%', background: 'var(--gradient-orange)' }} data-label="Carrier E"></div>
                </div>
                <div className="dash-carriers">
                  <span className="carrier-chip active">Melhor custo</span>
                  <span className="carrier-chip">Mais rápido</span>
                  <span className="carrier-chip">Maior cobertura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="como">
        <div className="container">
          <div className="how-header fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>Implementação</div>
            <h2>Conecta em minutos. Funciona no mesmo dia.</h2>
            <p>Sem projeto de TI. Sem meses de integração.</p>
          </div>
          <div className="how-steps">
            <div className="how-step fade-up">
              <div className="step-num">1</div>
              <h3>Integre sua loja</h3>
              <p>Shopify, VTEX, WooCommerce e outros. Sem código, sem dev.</p>
            </div>
            <div className="how-step fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="step-num">2</div>
              <h3>Configure seus fluxos</h3>
              <p>Rastreio, trocas, notificações. Interface simples, sem treinamento.</p>
            </div>
            <div className="how-step fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="step-num">3</div>
              <h3>Pós-venda vira diferencial</h3>
              <p>O cliente sente. Sua equipe respira. Sua margem agradece.</p>
            </div>
          </div>
          <div className="integration-logos fade-up" style={{ transitionDelay: '0.3s' }}>
            {['Shopify', 'VTEX', 'WooCommerce', 'Nuvemshop', 'Tray'].map((name) => (
              <span className="int-logo" key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="proof-section">
        <div className="container">
          <div className="proof-header fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>Depoimentos</div>
            <h2>Quem já parou de apagar incêndio</h2>
          </div>
          <div className="proof-grid">
            <div className="proof-card fade-up">
              <div className="proof-quote-mark">"</div>
              <blockquote>Antes da Kanglu, meu time passava metade do dia respondendo 'cadê meu pedido'. Hoje esse volume simplesmente zerou.</blockquote>
              <div className="proof-author">
                <div className="proof-avatar">RC</div>
                <div>
                  <div className="proof-name">Renata C.</div>
                  <div className="proof-role">Head de CX · E-commerce de moda</div>
                </div>
              </div>
            </div>
            <div className="proof-card fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="proof-quote-mark">"</div>
              <blockquote>A auditoria de frete se pagou no primeiro mês. Descobrimos cobranças que nunca teríamos visto sem o cruzamento automático.</blockquote>
              <div className="proof-author">
                <div className="proof-avatar">MS</div>
                <div>
                  <div className="proof-name">Marcos S.</div>
                  <div className="proof-role">COO · Suplementos D2C</div>
                </div>
              </div>
            </div>
            <div className="proof-card fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="proof-quote-mark">"</div>
              <blockquote>O fluxo de trocas tirou da minha equipe um processo que era 100% manual. Agora o cliente resolve sozinho e a gente foca em vender.</blockquote>
              <div className="proof-author">
                <div className="proof-avatar">JL</div>
                <div>
                  <div className="proof-name">Juliana L.</div>
                  <div className="proof-role">Fundadora · Cosméticos naturais</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTION KILLER */}
      <section className="objection-section">
        <div className="container">
          <div className="objection-grid">
            <div className="objection-header fade-up">
              <div className="section-label">Sem surpresas</div>
              <h2>Não é mais um sistema para integrar e esquecer.</h2>
            </div>
            <div className="objection-card fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="objection-icon">⚡</div>
              <div>
                <h4>Sem código.</h4>
                <p>Conecta na sua loja sem precisar de dev. Integração nativa com as principais plataformas.</p>
              </div>
            </div>
            <div className="objection-card fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="objection-icon">📊</div>
              <div>
                <h4>Sem planilha.</h4>
                <p>Tudo centralizado, tudo auditável. Dashboard único para rastreio, trocas e frete.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section" id="demo">
        <div className="container">
          <div className="cta-content fade-up">
            <h2>
              Troca sem atrito.<br />
              Rastreio sem ticket.<br />
              <span className="cta-highlight">Pós‑venda que faz a marca crescer.</span>
            </h2>
            <p>Fale com a gente e veja como a Kanglu funciona na prática, com os dados da sua operação.</p>
            <a href="#" className="cta-btn">Quero minha demo gratuita →</a>
            <div className="cta-micro">Sem compromisso. Sem contrato de 12 meses para começar.</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <span className="footer-logo">kanglu.</span>
          <span className="footer-text">Feito para e-commerces que levam o pós-venda a sério.</span>
          <div className="footer-links">
            <a href="#">@kanglu</a>
            <a href="#">kanglu.com.br</a>
          </div>
        </div>
      </footer>

      {/* DEMO MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={handleCloseModal}
              aria-label="Fechar modal"
            >
              ✕
            </button>

            {submitSuccess ? (
              <div className="modal-success">
                <div className="success-icon">✓</div>
                <h2>Recebemos sua solicitação!</h2>
                <p>Nosso time vai entrar em contato com <strong>{formData.name}</strong> em breve para agendar a demo.</p>
                <button className="btn-form-submit" onClick={handleCloseModal}>
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Agendar minha demo</h2>
                  <p>Preencha os dados abaixo. Nosso time entra em contato em breve.</p>
                </div>
                <form className="demo-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Seu nome</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="brandName">Qual o nome da sua marca?</label>
                    <input
                      type="text"
                      id="brandName"
                      name="brandName"
                      placeholder="Ex: Loja da Maria"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">Contato (e-mail ou WhatsApp)</label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      placeholder="seu@email.com ou (11) 99999-9999"
                      value={formData.contact}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="monthlyOrders">Quantos pedidos por mês?</label>
                    <select
                      id="monthlyOrders"
                      name="monthlyOrders"
                      value={formData.monthlyOrders}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma faixa</option>
                      <option value="500">500</option>
                      <option value="1000">1.000</option>
                      <option value="5000">5.000</option>
                      <option value="10000+">+10.000</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="source">Por onde nos conheceu?</label>
                    <select
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="google">Google</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="recomendacao">Recomendação</option>
                      <option value="evento">Evento</option>
                      <option value="redes">Redes sociais</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  {submitError && (
                    <div className="form-error">{submitError}</div>
                  )}
                  <button type="submit" className="btn-form-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Agendar demo →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
