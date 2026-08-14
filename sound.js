/* Golden Order — efeitos sonoros retrô (8-bit), sintetizados na hora
   via Web Audio API. De propósito, sem nenhum arquivo de áudio pra
   baixar — no mesmo espírito "tudo escrito à mão, sem dependências"
   do resto do site. Carregado antes de tudo (inclusive i18n.js), pra
   já estar pronto quando qualquer outro script quiser tocar um som.

   Liga/desliga em Configurações > Som (ver i18n.js, que só sincroniza
   os botões — o estado em si e a reprodução moram aqui), lembrado no
   localStorage com a mesma lógica de idioma/tema.

   Como usar em qualquer outro arquivo:
     window.GoldenOrderSound.play('confirm');
   Nomes disponíveis: tap, open, confirm, decline, success, error —
   ver RECIPES abaixo pra adicionar um novo. */
(function () {
  const STORAGE_KEY = 'golden-order-sound';

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignora (modo privado etc.) */ }
  }

  function isMuted() {
    return safeGet(STORAGE_KEY) === 'off';
  }
  function setMuted(muted) {
    safeSet(STORAGE_KEY, muted ? 'off' : 'on');
  }

  // o AudioContext só é criado no primeiro som de verdade tocado (todo
  // navegador exige um gesto do usuário antes de liberar áudio — e
  // como play() só é chamado dentro de handlers de clique, isso já
  // acontece naturalmente, sem nenhum "desbloqueio" extra)
  let ctx = null;
  function getContext() {
    if (ctx) return ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    try {
      ctx = new AudioCtx();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  }

  // uma "nota" = uma onda quadrada curta com envelope simples (ataque
  // rápido, decaimento exponencial) — o jeito mais direto de soar
  // "8-bit" sem precisar de nenhum arquivo de áudio
  function note(c, freq, startAt, duration, gainPeak) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, startAt);
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.02);
  }

  // cada som é uma sequência curta de notas [frequência, atraso,
  // duração, volume] — pensadas pra soar como blips de menu de jogo
  // retrô, sempre com menos de meio segundo no total, nunca alto
  const RECIPES = {
    tap: [[660, 0, 0.05, 0.05]],
    open: [[520, 0, 0.07, 0.05], [780, 0.06, 0.09, 0.05]],
    confirm: [[660, 0, 0.06, 0.06], [880, 0.07, 0.1, 0.06]],
    decline: [[440, 0, 0.08, 0.05], [330, 0.08, 0.12, 0.05]],
    success: [[660, 0, 0.08, 0.06], [880, 0.09, 0.08, 0.06], [1108, 0.18, 0.16, 0.07]],
    error: [[220, 0, 0.16, 0.06]]
  };

  function play(name) {
    if (isMuted()) return;
    const c = getContext();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    const recipe = RECIPES[name];
    if (!recipe) return;
    const now = c.currentTime;
    recipe.forEach(([freq, delay, duration, gainPeak]) => {
      note(c, freq, now + delay, duration, gainPeak);
    });
  }

  window.GoldenOrderSound = { play, isMuted, setMuted };
})();
