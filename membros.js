/* Golden Order — desenha as linhas do organograma de membros.
   O HTML/CSS já funciona sem isso (cada card do organograma existe e
   é legível de qualquer jeito); isto aqui é só a camada visual extra
   que liga cada pessoa ao card de quem a recrutou, lendo o atributo
   data-recruiter="id-de-quem-chamou" de cada .member-node e desenhando
   uma curva entre os dois chips num <svg> posicionado por cima dos
   cards (mas atrás deles, via z-index — ver membros.css). */
(function () {
  const chart = document.getElementById('orgChart');
  const svg = document.getElementById('orgLines');
  if (!chart || !svg) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';

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
        const midY = (y1 + y2) / 2;

        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + midY + ', ' + x2 + ' ' + midY + ', ' + x2 + ' ' + y2);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--gold-4)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '5 5');
        path.setAttribute('opacity', '0.6');
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

  function refresh() {
    draw();
    labelRecruiters();
  }

  // redesenha depois de qualquer coisa que possa mudar o layout: resize
  // da janela (debounced), troca de idioma (textos com tamanhos
  // diferentes reorganizam os cards, e a legenda escondida também
  // precisa trocar de idioma) e o carregamento final da fonte (a Press
  // Start 2P via Google Fonts pode trocar depois do 1º layout)
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refresh);
  } else {
    refresh();
  }
})();