/* Golden Order — monta e desenha o organograma de membros.
   Duas partes: (1) renderFromData() constrói os cards a partir da
   lista em members-data.js — pra adicionar/remover/mudar alguém, é só
   editar aquele arquivo, nada aqui precisa mudar; (2) o resto deste
   arquivo desenha por cima as linhas de "quem chamou quem", lendo o
   atributo data-recruiter="id-de-quem-chamou" que renderFromData()
   coloca em cada .member-node, com uma curva entre os dois chips num
   <svg> posicionado por cima dos cards (mas atrás deles, via z-index
   — ver membros.css). */
(function () {
  const chart = document.getElementById('orgChart');
  const svg = document.getElementById('orgLines');
  if (!chart || !svg) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function t(key) {
    return window.GoldenOrderI18n ? window.GoldenOrderI18n.t(key) : key;
  }

  // constrói toda a árvore (fileiras por cargo + cards de cada pessoa)
  // a partir de window.GoldenOrderMembers (ver members-data.js). Roda
  // uma única vez, no carregamento — depois disso os cards já existem
  // no DOM e só as linhas/traduções são atualizadas (ver refresh()).
  function renderFromData() {
    const data = window.GoldenOrderMembers;
    if (!data || !Array.isArray(data.RANKS) || !Array.isArray(data.MEMBERS)) return;

    const byRank = new Map();
    data.RANKS.forEach((r) => byRank.set(r.key, []));
    data.MEMBERS.forEach((m) => {
      if (byRank.has(m.rank)) byRank.get(m.rank).push(m);
    });

    // quem é "par" de outra pessoa (couple) não vira um .member-node
    // solto na fileira — é desenhado junto do par, ver abaixo
    const coupleTargets = new Set(data.MEMBERS.filter((m) => m.couple).map((m) => m.couple));
    const byId = new Map(data.MEMBERS.map((m) => [m.id, m]));

    function buildMemberNode(m, lead) {
      const node = document.createElement('div');
      node.className = 'member-node';
      node.id = 'm-' + m.id;
      if (m.recruiter) node.dataset.recruiter = 'm-' + m.recruiter;

      const chip = document.createElement('span');
      chip.className = 'member-chip';
      if (lead) chip.classList.add('member-chip-lead');
      if (m.ex) chip.classList.add('member-chip-ex');

      const nameSpan = document.createElement('span');
      nameSpan.className = 'member-name';
      nameSpan.textContent = m.name;
      chip.appendChild(nameSpan);
      node.appendChild(chip);

      if (m.rankLabelKey) {
        const rankTag = document.createElement('span');
        rankTag.className = 'member-rank';
        rankTag.dataset.i18n = m.rankLabelKey;
        rankTag.textContent = t(m.rankLabelKey);
        node.appendChild(rankTag);
      }
      if (m.ex) {
        const exTag = document.createElement('span');
        exTag.className = 'member-ex-tag';
        exTag.dataset.i18n = 'member.exGuild';
        exTag.textContent = t('member.exGuild');
        node.appendChild(exTag);
      }
      return node;
    }

    data.RANKS.forEach((rankDef) => {
      const members = (byRank.get(rankDef.key) || []).filter((m) => !coupleTargets.has(m.id));

      const tier = document.createElement('div');
      tier.className = 'org-tier rank-' + rankDef.key;

      const label = document.createElement('p');
      label.className = 'org-tier-label';
      label.dataset.i18n = rankDef.i18n;
      label.textContent = t(rankDef.i18n);
      tier.appendChild(label);

      if (!members.length) {
        // cargo sem ninguém no momento (ex.: Artífice) — aviso
        // discreto no lugar da fileira de cards, ver .tier-empty-note
        const note = document.createElement('p');
        note.className = 'tier-empty-note';
        note.dataset.i18n = 'rank.emptyNotice';
        note.textContent = t('rank.emptyNotice');
        tier.appendChild(note);
      } else {
        const row = document.createElement('div');
        row.className = 'tier-row';
        members.forEach((m) => {
          if (m.couple) {
            const wrap = document.createElement('div');
            wrap.className = 'member-node member-node-couple';
            wrap.appendChild(buildMemberNode(m, rankDef.lead));

            const heart = document.createElement('span');
            heart.className = 'couple-heart';
            heart.dataset.i18nAriaLabel = 'member.couple';
            heart.setAttribute('aria-label', t('member.couple'));
            heart.textContent = '♥';
            wrap.appendChild(heart);

            const partner = byId.get(m.couple);
            if (partner) wrap.appendChild(buildMemberNode(partner, rankDef.lead));

            row.appendChild(wrap);
          } else {
            row.appendChild(buildMemberNode(m, rankDef.lead));
          }
        });
        tier.appendChild(row);
      }

      chart.appendChild(tier);
    });
  }

  function draw() {
    // limpa o que tinha desenhado antes (redesenha do zero a cada chamada)
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const chartRect = chart.getBoundingClientRect();
    svg.setAttribute('width', chartRect.width);
    svg.setAttribute('height', chartRect.height);
    svg.setAttribute('viewBox', '0 0 ' + chartRect.width + ' ' + chartRect.height);

    const nodes = Array.from(chart.querySelectorAll('.member-node[id][data-recruiter]'));

    // agrupa por recrutador antes de desenhar: quando uma pessoa chamou
    // várias outras (ex.: Mahou chamou 14), as linhas saem de pontos
    // espalhados ao longo da base do card dela em vez de todas do mesmo
    // pixel central — sem isso, muitas linhas saindo do mesmo ponto se
    // embolam visualmente bem na origem
    const byRecruiter = new Map();
    nodes.forEach((node) => {
      const recruiterId = node.getAttribute('data-recruiter');
      if (!byRecruiter.has(recruiterId)) byRecruiter.set(recruiterId, []);
      byRecruiter.get(recruiterId).push(node);
    });

    byRecruiter.forEach((recruits, recruiterId) => {
      const recruiter = document.getElementById(recruiterId);
      const fromChip = recruiter && recruiter.querySelector('.member-chip');
      if (!fromChip) return;
      const fromRect = fromChip.getBoundingClientRect();
      const y1 = fromRect.bottom - chartRect.top;

      // ordena os alvos da esquerda pra direita, pra espalhar os pontos
      // de saída na mesma ordem (sem cruzar as próprias linhas à toa)
      const withX2 = recruits.map((node) => {
        const toChip = node.querySelector('.member-chip');
        const toRect = toChip ? toChip.getBoundingClientRect() : null;
        return { node, toChip, toRect };
      }).filter((e) => e.toChip).sort((a, b) => a.toRect.left - b.toRect.left);

      const usableWidth = Math.max(fromRect.width - 16, 4);
      const startX = fromRect.left - chartRect.left + fromRect.width / 2 - usableWidth / 2;
      const count = withX2.length;

      withX2.forEach((entry, i) => {
        const x1 = count > 1 ? startX + (usableWidth * i) / (count - 1) : startX + usableWidth / 2;
        const x2 = entry.toRect.left + entry.toRect.width / 2 - chartRect.left;
        const y2 = entry.toRect.top - chartRect.top;
        // curva assimétrica (em vez de um cotovelo reto vertical) — o
        // controle desliza um pouco na horizontal também, então a linha
        // sai em diagonal suave, mais raiz/vinha do que cano de cano
        const dx = x2 - x1;
        const dy = y2 - y1;
        const c1x = x1 + dx * 0.15;
        const c1y = y1 + dy * 0.35;
        const c2x = x2 - dx * 0.15;
        const c2y = y1 + dy * 0.65;

        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + c1x + ' ' + c1y + ', ' + c2x + ' ' + c2y + ', ' + x2 + ' ' + y2);
        path.setAttribute('class', 'org-line');
        path.dataset.from = recruiterId;
        path.dataset.to = entry.node.id;
        svg.appendChild(path);
      });
    });
  }

  // texto visualmente escondido (mas lido por leitor de tela / continua
  // no HTML mesmo se o SVG não desenhar por algum motivo) dizendo quem
  // chamou cada pessoa — a linha é reforço visual, essa frase é a
  // informação em si, sempre presente
  function labelRecruiters() {
    const nodes = chart.querySelectorAll('.member-node[id][data-recruiter]');
    nodes.forEach((node) => {
      const recruiterId = node.getAttribute('data-recruiter');
      const recruiter = document.getElementById(recruiterId);
      const fromChip = recruiter && recruiter.querySelector('.member-chip');
      if (!fromChip) return;

      const prefix = window.GoldenOrderI18n ? window.GoldenOrderI18n.t('member.calledBy') : 'chamado por';
      let label = node.querySelector('.member-recruiter-sr');
      if (!label) {
        label = document.createElement('span');
        label.className = 'member-recruiter-sr sr-only';
        node.appendChild(label);
      }
      label.textContent = prefix + ' ' + fromChip.textContent.trim();
    });
  }

  // ao passar o mouse (ou focar, pelo teclado) numa pessoa, os fios que
  // ligam ela a quem a chamou E a quem ela chamou brilham, e o resto
  // apaga — assim dá pra seguir uma ligação específica sem se perder
  // no emaranhado de todas as outras ao mesmo tempo
  let currentActiveId = null;
  function setActiveNode(id) {
    currentActiveId = id;
    const paths = svg.querySelectorAll('path');
    const related = new Set(id ? [id] : []);
    paths.forEach((p) => {
      const isRelated = !!id && (p.dataset.from === id || p.dataset.to === id);
      p.classList.toggle('org-line-active', isRelated);
      p.classList.toggle('org-line-dim', !!id && !isRelated);
      if (isRelated) {
        related.add(p.dataset.from);
        related.add(p.dataset.to);
      }
    });
    chart.querySelectorAll('.member-chip-linked').forEach((c) => c.classList.remove('member-chip-linked'));
    related.forEach((rid) => {
      const node = document.getElementById(rid);
      const chip = node && node.querySelector('.member-chip');
      if (chip) chip.classList.add('member-chip-linked');
    });
  }

  // liga o hover/foco uma única vez (os elementos com id não são
  // recriados a cada redraw, só os <path> — só as linhas precisam ser
  // religadas, e isso já é resolvido lendo data-from/data-to direto
  // do DOM a cada chamada de setActiveNode, sem guardar referências)
  function wireInteractivity() {
    const nodes = chart.querySelectorAll('.member-node[id]');
    nodes.forEach((node) => {
      if (node.dataset.hoverWired) return;
      node.dataset.hoverWired = '1';
      node.tabIndex = 0;
      node.addEventListener('mouseenter', () => setActiveNode(node.id));
      node.addEventListener('mouseleave', () => setActiveNode(null));
      node.addEventListener('focus', () => setActiveNode(node.id));
      node.addEventListener('blur', () => setActiveNode(null));
    });
  }

  function refresh() {
    draw();
    labelRecruiters();
    wireInteractivity();
    // se alguém estava com o mouse/foco em cima de uma pessoa quando o
    // redraw aconteceu (resize, troca de idioma, fonte terminando de
    // carregar...), os <path> antigos foram recriados do zero e
    // perderam as classes de destaque — reaplica pro id que já estava
    // ativo, senão o brilho "trava desligado" até o mouse sair e voltar
    if (currentActiveId) setActiveNode(currentActiveId);
  }

  // redesenha depois de qualquer coisa que possa mudar o layout: resize
  // da janela (debounced), troca de idioma (textos com tamanhos
  // diferentes reorganizam os cards, e a legenda escondida também
  // precisa trocar de idioma) e o carregamento final da fonte (a Press
  // Start 2P via Google Fonts pode trocar depois do 1º layout). Note
  // que só refresh() roda nesses eventos, não renderFromData() de
  // novo — os cards já existem, só as linhas/traduções precisam
  // acompanhar (a troca de idioma em si já é tratada pelo próprio
  // i18n.js, que re-varre todo [data-i18n] da página, cards incluídos).
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refresh, 150);
  });
  window.addEventListener('golden-order-i18n-changed', () => setTimeout(refresh, 50));
  window.addEventListener('load', () => setTimeout(refresh, 50));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setTimeout(refresh, 30));
  }

  // renderFromData() monta os cards uma única vez, no carregamento;
  // refresh() então desenha as linhas por cima deles pela 1ª vez
  function init() {
    renderFromData();
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();