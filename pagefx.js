/* Golden Order — transição de página em "wipe" pixelado, sem framework
   nem lib de animação: ao clicar em qualquer link interno do site, a
   tela "fecha" (um retângulo cobre o viewport em passos — steps(), de
   propósito não suave — ver .page-wipe em style.css) antes de navegar
   de verdade; a página que abre já nasce coberta (o script inline logo
   no início do <body> de cada página faz isso ANTES da primeira
   pintura, pra não ter flash) e se revela do mesmo jeito ao carregar.

   Carregado logo depois de sound.js, antes de i18n.js — mesma lógica:
   já estar pronto antes de qualquer outro script precisar navegar.

   Esse arquivo também é o único lugar que decide o som de cada
   navegação (aceitar/recusar/voltar). Antes isso estava espalhado
   dentro de script.js (só pros botões de aceitar/recusar); agora vive
   junto da navegação em si, num lugar só, e vale pro site inteiro —
   inclusive os links "Voltar ao convite" e "Membros". */
(function () {
  // respeita "reduzir movimento" do sistema: a troca ainda cobre a
  // tela (evita o salto seco de uma página pra outra), só sem a
  // animação — ver .page-wipe em style.css, que já zera a duração da
  // transição nesse caso; aqui só encurtamos a espera antes de navegar
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = REDUCED_MOTION ? 60 : 430; // precisa bater com a transição em .page-wipe (style.css)

  function wipeEl() {
    return document.getElementById('pageWipe');
  }

  function revealOnLoad() {
    const el = wipeEl();
    if (!el) return;
    // a página já nasce coberta (script inline no <body>) — dois rAF
    // garantem que esse quadro coberto já foi pintado antes de tirar a
    // classe, senão alguns navegadores pulam a transição direto pro
    // estado final
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => el.classList.remove('cover'));
    });
  }

  function isInternalLink(a) {
    const href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(href)) return false; // http(s)://, //cdn etc
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return false;
    if (a.target === '_blank') return false;
    return true;
  }

  function soundFor(a, href) {
    if (a.classList.contains('back-link')) return 'tap';
    if (a.closest('.card-actions')) {
      return href.indexOf('questionario') !== -1 ? 'confirm' : 'decline';
    }
    return null;
  }

  function goTo(href) {
    const el = wipeEl();
    if (!el) {
      window.location.href = href;
      return;
    }
    el.classList.add('cover');
    window.setTimeout(() => {
      window.location.href = href;
    }, DURATION);
  }

  function wireLinks() {
    document.querySelectorAll('a[href]').forEach((a) => {
      if (!isInternalLink(a)) return;
      a.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        const href = a.getAttribute('href');
        const sound = soundFor(a, href);
        if (sound && window.GoldenOrderSound) window.GoldenOrderSound.play(sound);
        goTo(href);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireLinks);
  } else {
    wireLinks();
  }
  revealOnLoad();

  window.GoldenOrderPageFX = { goTo };
})();