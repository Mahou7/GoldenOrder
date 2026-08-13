// --- floating pixel embers ---
  const particleHost = document.getElementById('particles');
  const EMBER_COUNT = 18; // fewer particles = smoother on lower-end devices
  for (let i = 0; i < EMBER_COUNT; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    const left = Math.random() * 100;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 10;
    const drift = (Math.random() * 60 - 30) + 'px';
    const size = 3 + Math.round(Math.random() * 3);
    e.style.left = left + 'vw';
    e.style.width = size + 'px';
    e.style.height = size + 'px';
    e.style.setProperty('--drift', drift);
    e.style.animationDuration = duration + 's';
    e.style.animationDelay = delay + 's';
    particleHost.appendChild(e);
  }

  // --- intro sequence -> reveal main ---
  const intro = document.getElementById('intro');
  const main = document.getElementById('main');
  let revealed = false;

  function revealMain(){
    if (revealed) return;
    revealed = true;
    intro.classList.add('hide');
    main.classList.add('reveal');
  }

  // a tela de entrada só sai quando o usuário clicar/tocar nela
  // (sem avanço automático por tempo)
  intro.addEventListener('click', revealMain);
  intro.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') revealMain();
  });

  // --- painéis expansíveis (bilhete de convite + regras) ---
  // mesmo padrão dos dois: um botão com aria-expanded controla um
  // wrapper que anima de altura 0 até o conteúdo (ver .ticket-expand-wrap
  // no style.css), então centralizei a lógica aqui pra não repetir código.
  // sealId é opcional: quando informado, o selo de cera correspondente
  // "quebra" (classe .cracked) junto com a abertura do bilhete
  function wireExpandable(toggleId, expandId, openLabel, closedLabel, sealId) {
    const toggle = document.getElementById(toggleId);
    const expand = document.getElementById(expandId);
    const seal = sealId ? document.getElementById(sealId) : null;
    if (!toggle || !expand) return;
    toggle.addEventListener('click', () => {
      const isOpen = expand.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.querySelector('.toggle-text').textContent = isOpen ? openLabel : closedLabel;
      if (seal) seal.classList.toggle('cracked', isOpen);
    });
  }
  wireExpandable('ticketToggle', 'ticketExpand', 'Fechar', 'Ver o convite completo', 'inviteSeal');
  wireExpandable('rulesToggle', 'rulesExpand', 'Fechar', 'Ver as regras', 'rulesSeal');

  // --- personalização: ?para=Nome na URL mostra pra quem é o convite ---
  (function personalizeInvite() {
    const params = new URLSearchParams(window.location.search);
    const name = (params.get('para') || '').trim().slice(0, 40);
    const recipient = document.getElementById('ticketRecipient');
    if (name && recipient) {
      recipient.textContent = 'Este convite pertence a: ' + name;
      recipient.hidden = false;
    }
  })();

  // --- status do servidor (definido manualmente, sem consultar nada) ---
  // Troque SERVER_STATUS pra 'offline' quando o servidor cair, e volte
  // pra 'online' quando subir de novo. STATUS_LABEL é o texto exibido
  // (pode incluir contagem de jogadores se você quiser, ex: "Online — 8/20").
  const SERVER_STATUS = 'online'; // 'online' ou 'offline'
  const STATUS_LABEL = {
    online: 'Servidor online',
    offline: 'Servidor offline no momento'
  };

  (function setServerStatus() {
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    if (!dot || !text) return;
    dot.classList.add(SERVER_STATUS);
    text.textContent = STATUS_LABEL[SERVER_STATUS];
  })();

  // --- revelar seções ao rolar a página ---
  // qualquer elemento com .scroll-reveal ganha .in-view (definindo a
  // animação de fade + leve deslocamento em style.css) assim que entra
  // na tela; só revela uma vez, não esconde de novo ao rolar pra cima
  const revealTargets = document.querySelectorAll('.scroll-reveal');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // --- CTA flutuante: aparece quando o CTA original sai da tela ---
  // (e só depois que a intro foi dispensada, pra não aparecer flutuando
  // por cima da tela de entrada)
  const floatingCta = document.getElementById('floatingCta');
  const ctaWrap = document.querySelector('.cta-wrap');
  if (floatingCta && ctaWrap && 'IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      floatingCta.classList.toggle('show', revealed && !entry.isIntersecting);
    }, { threshold: 0 });
    ctaObserver.observe(ctaWrap);
  }