// toca um efeito sonoro retrô, se o módulo existir e o som estiver
// ligado (ver sound.js — ele mesmo decide se toca ou não, então isso
// aqui é só uma chamada segura mesmo se sound.js não tiver carregado)
function playSound(name) {
  if (window.GoldenOrderSound) window.GoldenOrderSound.play(name);
}

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
    playSound('tap');
    intro.classList.add('hide');
    main.classList.add('reveal');
  }

  // a tela de entrada só sai quando o usuário clicar/tocar nela
  // (sem avanço automático por tempo)
  intro.addEventListener('click', revealMain);
  intro.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') revealMain();
  });

  // --- personalização: ?para=Nome na URL troca "você"/"you"/"ti" pelo
  // nome de quem recebeu o convite, direto na frase do bilhete. Sem
  // nome, mostra o pronome genérico no idioma atual — e continua
  // certo se a pessoa trocar de idioma depois, pelo painel de
  // configurações (ver i18n.js), sem apagar um nome real que já
  // estivesse ali. ---
  (function personalizeInvite() {
    const params = new URLSearchParams(window.location.search);
    const name = (params.get('para') || '').trim().slice(0, 40);
    const recipient = document.getElementById('ticketRecipient');
    if (!recipient) return;

    function render() {
      if (name) {
        recipient.textContent = name;
      } else if (window.GoldenOrderI18n) {
        recipient.textContent = window.GoldenOrderI18n.t('invite.you');
      }
    }
    render();
    window.addEventListener('golden-order-i18n-changed', render);
  })();

  // --- selo de validade do convite: "Convite Nº ####" (só aparece com
  // ?para=Nome — número vem de um hash determinístico do nome, então é
  // sempre o mesmo pra essa pessoa) + "Válido até DD/MM/AAAA" (contado
  // a partir de hoje). É só clima — não existe checagem real de prazo
  // em lugar nenhum. Pra mudar a janela de validade, troque só o
  // número abaixo. ---
  const INVITE_VALID_DAYS = 14;

  (function renderInviteSeal() {
    const numberLine = document.getElementById('inviteSealNumber');
    const numberValue = document.getElementById('inviteSealNumberValue');
    const dateValue = document.getElementById('inviteSealDateValue');
    if (!numberLine || !numberValue || !dateValue) return;

    const params = new URLSearchParams(window.location.search);
    const name = (params.get('para') || '').trim();

    if (name) {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
      }
      numberValue.textContent = String(1000 + (hash % 9000));
      numberLine.hidden = false;
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + INVITE_VALID_DAYS);
    const LOCALE_BY_LANG = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

    function render() {
      const lang = window.GoldenOrderI18n ? window.GoldenOrderI18n.getLang() : 'pt';
      const locale = LOCALE_BY_LANG[lang] || 'pt-BR';
      try {
        dateValue.textContent = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(validUntil);
      } catch (e) {
        dateValue.textContent = validUntil.toLocaleDateString();
      }
    }
    render();
    window.addEventListener('golden-order-i18n-changed', render);
  })();

  // --- propaga o ?para=Nome pros links de aceitar/recusar, pra que
  // recusado.html (que avisa no Discord quando alguém recusa) saiba
  // quem foi — sem parâmetro, os links continuam funcionando normal ---
  (function propagateRecipientParam() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('para');
    if (!name) return;
    document.querySelectorAll('.card-actions a').forEach((link) => {
      const url = new URL(link.getAttribute('href'), window.location.href);
      url.searchParams.set('para', name);
      link.setAttribute('href', url.pathname + url.search);
    });
  })();

  // --- convite: o gatilho de abrir é um prompt "aperte para continuar"
  // (não um objeto/ícone) que dá um flash rápido (.opening), estoura
  // num punhado de partículas douradas e some com um fade, enquanto o
  // texto surge linha a linha logo abaixo. ---
  (function wireInviteCard() {
    const cardClosed = document.getElementById('cardClosed');
    const cardReveal = document.getElementById('cardReveal');
    const sealWrap = document.getElementById('sealWrap');
    if (!cardClosed || !cardReveal || !sealWrap) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function spawnSealBurst() {
      if (prefersReducedMotion) return;
      const rect = cardClosed.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const COUNT = 16;
      for (let i = 0; i < COUNT; i++) {
        const angle = (Math.PI * 2 * i) / COUNT + (Math.random() * 0.4 - 0.2);
        const dist = 60 + Math.random() * 70;
        const p = document.createElement('span');
        p.className = 'seal-burst-particle';
        p.style.left = cx + 'px';
        p.style.top = cy + 'px';
        p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        p.style.animationDelay = (Math.random() * 0.05) + 's';
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
      }
    }

    cardClosed.addEventListener('click', () => {
      cardClosed.classList.add('opening');
      playSound('open');
      spawnSealBurst();
      cardReveal.classList.add('open');
      cardClosed.setAttribute('aria-expanded', 'true');
      sealWrap.classList.add('is-open');
      // só tira o selo do fluxo (display:none) depois do fade terminar,
      // senão o texto revelado "pula" pro lugar em vez de crescer suave
      window.setTimeout(() => {
        sealWrap.style.display = 'none';
      }, prefersReducedMotion ? 0 : 320);
    });
  })();

  // --- o blip de som ao clicar em "Aceitar"/"Recusar", e a navegação
  // em si (com a transição de tela em wipe pixelado), agora moram
  // juntas num lugar só: ver pagefx.js, que intercepta TODO link
  // interno do site, não só os de .card-actions. ---

  // --- status do servidor (definido manualmente, sem consultar nada) ---
  // Troque SERVER_STATUS pra 'offline' quando o servidor cair, e volte
  // pra 'online' quando subir de novo. O texto exibido vem do dicionário
  // de idiomas (chaves server.online/server.offline em i18n.js), pra
  // acompanhar o idioma escolhido — inclusive se for trocado depois,
  // sem precisar recarregar a página.
  const SERVER_STATUS = 'online'; // 'online' ou 'offline'
  const STATUS_KEY = {
    online: 'server.online',
    offline: 'server.offline'
  };

  (function setServerStatus() {
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    if (!dot || !text) return;
    dot.classList.add(SERVER_STATUS);

    function render() {
      text.textContent = window.GoldenOrderI18n
        ? window.GoldenOrderI18n.t(STATUS_KEY[SERVER_STATUS])
        : text.textContent;
    }
    render();
    window.addEventListener('golden-order-i18n-changed', render);
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