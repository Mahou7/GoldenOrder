/* Golden Order — idioma e tema, compartilhados por todas as páginas.
   ============================================================
   Guarda a escolha no localStorage do navegador (funciona porque este
   site roda como arquivos estáticos no mesmo domínio — não é um
   preview/artefato temporário), então quem escolher "Claro" ou
   "English" numa página continua vendo assim ao navegar pras outras.

   Como usar em qualquer elemento novo:
     - texto:            <span data-i18n="minha.chave">Texto em PT</span>
     - aria-label:        data-i18n-aria-label="minha.chave"
     - título da aba:      <body data-i18n-doctitle="minha.chave">
   O texto em português já escrito no HTML serve de fallback caso uma
   chave não exista no dicionário.

   Textos que NÃO entram aqui de propósito: os campos que vão pro
   Discord da staff (webhook de confirmação/recusa, resumo de
   contingência por e-mail) — esses ficam sempre em português,
   porque quem lê é a administração do clã, não quem preenche.
   ============================================================ */
(function () {
  const DICT = {
    pt: {
      'nav.backToInvite': 'Voltar ao convite',
      'nav.members': 'Membros',
      'footer.tagline': 'Feito para um, não para todos',

      'intro.toast': 'NOVA JORNADA INICIADA: CONVITE ENCONTRADO',
      'intro.loading': 'Carregando o convite...',
      'intro.hint': 'Toque para entrar',

      'index.kicker': 'Um grupo de amigos, construído em blocos',
      'invite.prompt': 'Uma mensagem da Golden Order aguarda por você.',
      'invite.open': 'Ler Convite',
      'invite.you': 'Você',
      'card.from': 'De',
      'card.senderRole': 'Líder da Golden Order',
      'card.bodyPrefix': '',
      'card.bodyRest': ' foi convidado(a) a fazer parte da Golden Order — um clã criado por um grupo de amigos, que vai chamando aos poucos quem cruza nosso caminho.',
      'card.bodyPhilosophy': 'Não é sobre competir, colecionar ou acumular — é sobre juntar gente ativa e capacitada, de áreas diferentes, pra crescer e jogar junto.',
      'card.question': 'Aceita entrar para a Ordem?',
      'btn.accept': 'Aceitar',
      'btn.decline': 'Recusar',
      'server.online': 'Servidor online',
      'server.offline': 'Servidor offline no momento',

      'settings.button': 'Configurações',
      'settings.title': 'Configurações',
      'settings.language': 'Idioma',
      'settings.theme': 'Tema',
      'settings.dark': 'Escuro',
      'settings.light': 'Claro',
      'settings.sound': 'Som',
      'settings.soundOn': 'Ativado',
      'settings.soundOff': 'Desativado',
      'settings.close': 'Fechar',

      'doc.title.index': 'Golden Order — Convite',
      'doc.title.questionario': 'Golden Order — Confirmação de Convite',
      'doc.title.recusado': 'Golden Order — Até uma Próxima',
      'doc.title.membros': 'Golden Order — Árvore de Membros',

      'questionario.kicker': 'Confirme seu Convite',
      'field.age': 'Idade',
      'field.nick': 'Nick no jogo',
      'field.name': 'Nome',
      'field.discord': 'Discord',
      'field.about': 'Fale um pouco sobre você',
      'btn.submit': 'Confirmar Entrada',
      'btn.submitting': 'Enviando...',
      'modal.success.title': 'CONVITE CONFIRMADO!',
      'modal.success.text': 'Sua confirmação chegou até a Golden Order. Fique de olho no Discord — alguém do clã vai te chamar em breve.',
      'modal.email.title': 'QUASE LÁ!',
      'modal.email.text': 'Seu app de e-mail deve abrir com a confirmação pronta — é só clicar em enviar. Se nada abrir, copie o resumo abaixo e envie manualmente.',
      'modal.error.title': 'ALGO DEU ERRADO',
      'modal.error.text': 'O envio automático falhou. Copie o resumo abaixo e cole no Discord da Golden Order — ninguém vai perder sua confirmação por isso.',
      'achievement.title': 'Conquista desbloqueada',
      'achievement.body': 'Membro da Golden Order',
      'form.note.error': 'Não deu pra enviar agora. Copie o resumo abaixo e envie pelo Discord do clã.',
      'modal.copy': 'Copiar resumo',
      'modal.copied': 'Copiado!',
      'modal.understood': 'Entendido',

      'recusado.kicker': 'Até uma Próxima',
      'recusado.intro': 'Antes de ir, deixe seu nick no jogo — é só pra Golden Order saber quem passou por aqui.',
      'btn.confirmDecline': 'Confirmar Recusa',
      'recusado.warn': 'Atenção: ao confirmar, a Golden Order vai entender que você realmente não quer entrar — ninguém do clã vai entrar em contato depois disso. Tem certeza?',
      'btn.back': 'Voltar',
      'btn.yesDecline': 'Sim, Recusar',
      'recusado.farewell1': 'Tudo bem. Obrigado pelo tempo que dedicou a este convite — ele foi feito a dedo, pensando em você, e sua resposta é totalmente respeitada.',
      'recusado.farewell2': 'Se um dia mudar de ideia, a porta da Golden Order continua aberta.',

      'membros.kicker': 'A Árvore da Ordem',
      'rank.leader': 'Líder',
      'rank.coleader': 'Co-líder',
      'rank.masterArtisan': 'Artífice Mestre',
      'rank.grandMaster': 'Grão Mestre',
      'rank.master': 'Mestre',
      'rank.artisan': 'Artífice',
      'rank.emptyNotice': 'Nenhum membro nesse cargo ainda',
      'rank.consecrated': 'Consagrado',
      'rank.sworn': 'Juramentado',
      'rank.swornFem': 'Juramentada',
      'rank.recruit': 'Recruta',
      'member.exGuild': 'Não está mais na guilda',
      'member.calledBy': 'chamado por',
      'member.couple': 'Casal',
      'tree.note': 'Cada ligação mostra quem trouxe quem pra Golden Order.'
    },

    en: {
      'nav.backToInvite': 'Back to the invite',
      'nav.members': 'Members',
      'footer.tagline': 'Made for one, not for everyone',

      'intro.toast': 'NEW JOURNEY BEGUN: INVITE FOUND',
      'intro.loading': 'Loading the invite...',
      'intro.hint': 'Tap to enter',

      'index.kicker': 'A group of friends, built in blocks',
      'invite.prompt': 'A message from the Golden Order awaits you.',
      'invite.open': 'Read Invite',
      'invite.you': 'you',
      'card.from': 'From',
      'card.senderRole': 'Leader of the Golden Order',
      'card.bodyPrefix': 'The Golden Order has extended an invitation to ',
      'card.bodyRest': ' — a clan created by a group of friends, who slowly bring in whoever crosses our path.',
      'card.bodyPhilosophy': "It's not about competing, collecting, or stacking wealth — it's about gathering active, capable people from different backgrounds to grow and play together.",
      'card.question': 'Will you join the Order?',
      'btn.accept': 'Accept',
      'btn.decline': 'Decline',
      'server.online': 'Server online',
      'server.offline': 'Server offline right now',

      'settings.button': 'Settings',
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.dark': 'Dark',
      'settings.light': 'Light',
      'settings.sound': 'Sound',
      'settings.soundOn': 'On',
      'settings.soundOff': 'Off',
      'settings.close': 'Close',

      'doc.title.index': 'Golden Order — Invite',
      'doc.title.questionario': 'Golden Order — Invite Confirmation',
      'doc.title.recusado': 'Golden Order — Until Next Time',
      'doc.title.membros': 'Golden Order — Member Tree',

      'questionario.kicker': 'Confirm Your Invite',
      'field.age': 'Age',
      'field.nick': 'In-game nickname',
      'field.name': 'Name',
      'field.discord': 'Discord',
      'field.about': 'Tell us a bit about yourself',
      'btn.submit': 'Confirm Entry',
      'btn.submitting': 'Sending...',
      'modal.success.title': 'INVITE CONFIRMED!',
      'modal.success.text': 'Your confirmation has reached the Golden Order. Keep an eye on Discord — someone from the clan will reach out soon.',
      'modal.email.title': 'ALMOST THERE!',
      'modal.email.text': 'Your email app should open with the confirmation ready — just hit send. If nothing opens, copy the summary below and send it manually.',
      'modal.error.title': 'SOMETHING WENT WRONG',
      'modal.error.text': "The automatic submission failed. Copy the summary below and paste it into the Golden Order's Discord — your confirmation won't be lost.",
      'achievement.title': 'Achievement unlocked',
      'achievement.body': 'Member of the Golden Order',
      'form.note.error': "Couldn't send it right now. Copy the summary below and send it through the clan's Discord.",
      'modal.copy': 'Copy summary',
      'modal.copied': 'Copied!',
      'modal.understood': 'Got it',

      'recusado.kicker': 'Until Next Time',
      'recusado.intro': 'Before you go, leave your in-game nickname — just so the Golden Order knows who came by.',
      'btn.confirmDecline': 'Confirm Decline',
      'recusado.warn': "Heads up: once confirmed, the Golden Order will take it that you truly don't want to join — no one from the clan will reach out afterward. Are you sure?",
      'btn.back': 'Back',
      'btn.yesDecline': 'Yes, Decline',
      'recusado.farewell1': "That's okay. Thank you for taking the time with this invite — it was made just for you, and your answer is fully respected.",
      'recusado.farewell2': "If you ever change your mind, the Golden Order's door stays open.",

      'membros.kicker': "The Order's Tree",
      'rank.leader': 'Leader',
      'rank.coleader': 'Co-Leader',
      'rank.masterArtisan': 'Master Artisan',
      'rank.grandMaster': 'Grand Master',
      'rank.master': 'Master',
      'rank.artisan': 'Artisan',
      'rank.emptyNotice': 'No member holds this rank yet',
      'rank.consecrated': 'Consecrated',
      'rank.sworn': 'Sworn',
      'rank.swornFem': 'Sworn',
      'rank.recruit': 'Recruit',
      'member.exGuild': 'No longer in the guild',
      'member.calledBy': 'called in by',
      'member.couple': 'Couple',
      'tree.note': 'Each link shows who brought whom into the Golden Order.'
    },

    es: {
      'nav.backToInvite': 'Volver a la invitación',
      'nav.members': 'Miembros',
      'footer.tagline': 'Hecho para uno, no para todos',

      'intro.toast': 'NUEVA JORNADA INICIADA: INVITACIÓN ENCONTRADA',
      'intro.loading': 'Cargando la invitación...',
      'intro.hint': 'Toca para entrar',

      'index.kicker': 'Un grupo de amigos, construido en bloques',
      'invite.prompt': 'Un mensaje de la Golden Order te espera.',
      'invite.open': 'Leer Invitación',
      'invite.you': 'ti',
      'card.from': 'De',
      'card.senderRole': 'Líder de la Golden Order',
      'card.bodyPrefix': 'La Golden Order ha extendido una invitación a ',
      'card.bodyRest': ' — un clan creado por un grupo de amigos, que va sumando poco a poco a quien cruza nuestro camino.',
      'card.bodyPhilosophy': 'No se trata de competir, coleccionar o acumular — se trata de juntar gente activa y capacitada, de áreas distintas, para crecer y jugar juntos.',
      'card.question': '¿Aceptas unirte a la Orden?',
      'btn.accept': 'Aceptar',
      'btn.decline': 'Rechazar',
      'server.online': 'Servidor en línea',
      'server.offline': 'Servidor fuera de línea por ahora',

      'settings.button': 'Configuración',
      'settings.title': 'Configuración',
      'settings.language': 'Idioma',
      'settings.theme': 'Tema',
      'settings.dark': 'Oscuro',
      'settings.light': 'Claro',
      'settings.sound': 'Sonido',
      'settings.soundOn': 'Activado',
      'settings.soundOff': 'Desactivado',
      'settings.close': 'Cerrar',

      'doc.title.index': 'Golden Order — Invitación',
      'doc.title.questionario': 'Golden Order — Confirmación de Invitación',
      'doc.title.recusado': 'Golden Order — Hasta la Próxima',
      'doc.title.membros': 'Golden Order — Árbol de Miembros',

      'questionario.kicker': 'Confirma tu Invitación',
      'field.age': 'Edad',
      'field.nick': 'Nick en el juego',
      'field.name': 'Nombre',
      'field.discord': 'Discord',
      'field.about': 'Cuéntanos un poco sobre ti',
      'btn.submit': 'Confirmar Ingreso',
      'btn.submitting': 'Enviando...',
      'modal.success.title': '¡INVITACIÓN CONFIRMADA!',
      'modal.success.text': 'Tu confirmación llegó a la Golden Order. Mantente atento a Discord — alguien del clan te contactará pronto.',
      'modal.email.title': '¡YA CASI!',
      'modal.email.text': 'Tu app de correo debería abrirse con la confirmación lista — solo tienes que enviarla. Si no se abre nada, copia el resumen de abajo y envíalo manualmente.',
      'modal.error.title': 'ALGO SALIÓ MAL',
      'modal.error.text': 'El envío automático falló. Copia el resumen de abajo y pégalo en el Discord de la Golden Order — tu confirmación no se perderá.',
      'achievement.title': 'Logro desbloqueado',
      'achievement.body': 'Miembro de la Golden Order',
      'form.note.error': 'No se pudo enviar ahora. Copia el resumen de abajo y envíalo por el Discord del clan.',
      'modal.copy': 'Copiar resumen',
      'modal.copied': '¡Copiado!',
      'modal.understood': 'Entendido',

      'recusado.kicker': 'Hasta la Próxima',
      'recusado.intro': 'Antes de irte, deja tu nick en el juego — es solo para que la Golden Order sepa quién pasó por aquí.',
      'btn.confirmDecline': 'Confirmar Rechazo',
      'recusado.warn': 'Atención: al confirmar, la Golden Order entenderá que realmente no quieres entrar — nadie del clan se pondrá en contacto después de esto. ¿Estás seguro?',
      'btn.back': 'Volver',
      'btn.yesDecline': 'Sí, Rechazar',
      'recusado.farewell1': 'Está bien. Gracias por el tiempo que le dedicaste a esta invitación — fue hecha especialmente para ti, y tu respuesta es totalmente respetada.',
      'recusado.farewell2': 'Si algún día cambias de opinión, la puerta de la Golden Order sigue abierta.',

      'membros.kicker': 'El Árbol de la Orden',
      'rank.leader': 'Líder',
      'rank.coleader': 'Co-líder',
      'rank.masterArtisan': 'Artífice Maestro',
      'rank.grandMaster': 'Gran Maestro',
      'rank.master': 'Maestro',
      'rank.artisan': 'Artífice',
      'rank.emptyNotice': 'Aún no hay ningún miembro en este cargo',
      'rank.consecrated': 'Consagrado',
      'rank.sworn': 'Jurado',
      'rank.swornFem': 'Jurada',
      'rank.recruit': 'Recluta',
      'member.exGuild': 'Ya no está en el clan',
      'member.calledBy': 'invitado por',
      'member.couple': 'Pareja',
      'tree.note': 'Cada conexión muestra quién trajo a quién a la Golden Order.'
    }
  };

  const HTML_LANG = { pt: 'pt-BR', en: 'en-US', es: 'es' };
  const STORAGE_LANG = 'golden-order-lang';
  const STORAGE_THEME = 'golden-order-theme';

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignora (modo privado etc.) */ }
  }

  function getLang() {
    const saved = safeGet(STORAGE_LANG);
    return DICT[saved] ? saved : 'pt';
  }
  function getTheme() {
    return safeGet(STORAGE_THEME) === 'light' ? 'light' : 'dark';
  }

  function t(key) {
    const dict = DICT[getLang()] || DICT.pt;
    return dict[key] !== undefined ? dict[key] : (DICT.pt[key] !== undefined ? DICT.pt[key] : key);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
  }

  function applyLang(lang) {
    const dict = DICT[lang] ? lang : 'pt';
    document.documentElement.setAttribute('lang', HTML_LANG[dict]);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria-label');
      el.setAttribute('aria-label', t(key));
    });
    const titleKey = document.body && document.body.getAttribute('data-i18n-doctitle');
    if (titleKey) document.title = t(titleKey);

    document.querySelectorAll('.settings-option[data-lang]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-lang') === dict);
    });

    window.dispatchEvent(new CustomEvent('golden-order-i18n-changed', { detail: { lang: dict } }));
  }

  function setLang(lang) {
    safeSet(STORAGE_LANG, lang);
    applyLang(lang);
  }
  function setTheme(theme) {
    safeSet(STORAGE_THEME, theme);
    applyTheme(theme);
    document.querySelectorAll('.settings-option[data-theme]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-theme') === theme);
    });
  }

  // o som em si (tocar/sintetizar os blips) mora num arquivo à parte
  // (sound.js, carregado antes deste) — aqui só sincroniza o estado
  // "ligado/desligado" dos botões do painel de configurações com ele
  function syncSoundButtons() {
    const muted = window.GoldenOrderSound ? window.GoldenOrderSound.isMuted() : false;
    document.querySelectorAll('.settings-option[data-sound]').forEach((el) => {
      const wantsOn = el.getAttribute('data-sound') === 'on';
      el.classList.toggle('active', wantsOn !== muted);
    });
  }
  function setSound(on) {
    if (!window.GoldenOrderSound) return;
    window.GoldenOrderSound.setMuted(!on);
    syncSoundButtons();
  }

  // aplica o tema imediatamente (o <html> já recebeu um data-theme
  // "de emergência" via script inline no <head>, isso só garante que
  // fique coerente depois que este arquivo carrega) e o idioma assim
  // que o DOM estiver pronto pra ter os elementos [data-i18n] pra
  // preencher
  applyTheme(getTheme());
  function ready() {
    applyLang(getLang());
    document.querySelectorAll('.settings-option[data-theme]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-theme') === getTheme());
    });
    syncSoundButtons();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }

  // ---------- painel de configurações (só existe em quem tiver o HTML) ----------
  function wireSettingsPanel() {
    const btn = document.getElementById('settingsBtn');
    const overlay = document.getElementById('settingsOverlay');
    const closeBtn = document.getElementById('settingsClose');
    if (!btn || !overlay) return;

    function open() {
      if (window.GoldenOrderSound) window.GoldenOrderSound.play('tap');
      overlay.classList.add('show');
    }
    function close() { overlay.classList.remove('show'); }

    btn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    overlay.querySelectorAll('.settings-option[data-lang]').forEach((el) => {
      el.addEventListener('click', () => setLang(el.getAttribute('data-lang')));
    });
    overlay.querySelectorAll('.settings-option[data-theme]').forEach((el) => {
      el.addEventListener('click', () => setTheme(el.getAttribute('data-theme')));
    });
    overlay.querySelectorAll('.settings-option[data-sound]').forEach((el) => {
      el.addEventListener('click', () => setSound(el.getAttribute('data-sound') === 'on'));
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireSettingsPanel);
  } else {
    wireSettingsPanel();
  }

  window.GoldenOrderI18n = { t, getLang, setLang, getTheme, setTheme, applyLang, applyTheme };
})();