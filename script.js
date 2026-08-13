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
  function wireExpandable(toggleId, expandId, openLabel, closedLabel) {
    const toggle = document.getElementById(toggleId);
    const expand = document.getElementById(expandId);
    if (!toggle || !expand) return;
    toggle.addEventListener('click', () => {
      const isOpen = expand.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.querySelector('.toggle-text').textContent = isOpen ? openLabel : closedLabel;
    });
  }
  wireExpandable('ticketToggle', 'ticketExpand', 'Fechar', 'Ver o convite completo');
  wireExpandable('rulesToggle', 'rulesExpand', 'Fechar', 'Ver as regras');

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

  // --- galeria: lightbox simples pra ampliar os prints ---
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(fullSrc) {
    lightboxContent.innerHTML = '';
    if (fullSrc) {
      const img = document.createElement('img');
      img.src = fullSrc;
      img.alt = 'Print da construção';
      lightboxContent.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'lightbox-placeholder';
      placeholder.textContent = 'Nenhuma imagem definida ainda — veja o comentário no HTML de como adicionar.';
      lightboxContent.appendChild(placeholder);
    }
    lightboxOverlay.classList.add('show');
  }
  function closeLightbox() {
    lightboxOverlay.classList.remove('show');
  }

  document.querySelectorAll('.gallery-tile').forEach((tile) => {
    tile.addEventListener('click', () => openLightbox(tile.dataset.full));
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });