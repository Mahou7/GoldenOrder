/* Golden Order — formulário de ingresso.
   ============================================================
   CONFIGURAÇÃO: escolha UM dos dois modos de envio abaixo.

   OPÇÃO A — Webhook do Discord (recomendado, já que o "portão" é
   o Discord do clã):
     1. No canal onde as candidaturas devem cair, vá em
        Configurações do Canal > Integrações > Webhooks > Novo Webhook.
     2. Copie a "URL do Webhook" e cole abaixo em discordWebhookUrl.
     Pronto — o formulário passa a enviar direto pro canal.

   OPÇÃO B — E-mail (funciona sem nenhuma configuração de servidor):
     Deixe discordWebhookUrl vazio e troque fallbackEmail pelo seu
     e-mail. O formulário abre o app de e-mail do usuário com tudo
     preenchido — ele só precisa clicar em "enviar".
   ============================================================ */
const CONFIG = {
  discordWebhookUrl: '', // ex: 'https://discord.com/api/webhooks/xxxx/yyyy'
  fallbackEmail: 'SEU_EMAIL_AQUI@exemplo.com'
};

(function () {
  const form = document.getElementById('joinForm');
  const submitBtn = document.getElementById('submitBtn');
  const formNote = document.getElementById('formNote');

  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalSummary = document.getElementById('modalSummary');
  const modalCopy = document.getElementById('modalCopy');
  const modalClose = document.getElementById('modalClose');

  function fieldLabel(name) {
    const map = {
      nome: 'Nome/Apelido',
      nick_minecraft: 'Nick no Minecraft',
      idade: 'Idade',
      discord: 'Discord',
      tempo_de_jogo: 'Tempo de jogo',
      disponibilidade: 'Disponibilidade',
      motivo: 'Motivo',
      como_conheceu: 'Como conheceu o clã'
    };
    return map[name] || name;
  }

  function collectData() {
    const fd = new FormData(form);
    const data = {};
    for (const [key, value] of fd.entries()) {
      if (key === 'disponibilidade') {
        data[key] = data[key] ? data[key] + ', ' + value : value;
      } else {
        data[key] = value;
      }
    }
    return data;
  }

  function buildSummary(data) {
    const order = ['nome', 'nick_minecraft', 'idade', 'discord', 'tempo_de_jogo', 'disponibilidade', 'motivo', 'como_conheceu'];
    return order
      .filter((k) => data[k])
      .map((k) => `${fieldLabel(k)}: ${data[k]}`)
      .join('\n');
  }

  function openModal({ title, text, showSummary, summaryText, showCopy }) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    if (showSummary) {
      modalSummary.value = summaryText;
      modalSummary.hidden = false;
    } else {
      modalSummary.hidden = true;
    }
    modalCopy.hidden = !showCopy;
    modalOverlay.classList.add('show');
  }

  modalClose.addEventListener('click', () => modalOverlay.classList.remove('show'));
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('show');
  });
  modalCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(modalSummary.value);
      modalCopy.textContent = 'Copiado!';
      setTimeout(() => { modalCopy.textContent = 'Copiar resumo'; }, 1600);
    } catch (e) {
      modalSummary.select();
    }
  });

  async function sendToDiscord(data, summary) {
    const payload = {
      username: 'Golden Order — Convites',
      embeds: [{
        title: 'Convite confirmado',
        color: 15258402, // dourado
        fields: [
          { name: 'Nome/Apelido', value: data.nome || '—', inline: true },
          { name: 'Nick Minecraft', value: data.nick_minecraft || '—', inline: true },
          { name: 'Idade', value: data.idade || '—', inline: true },
          { name: 'Discord', value: data.discord || '—', inline: true },
          { name: 'Tempo de jogo', value: data.tempo_de_jogo || '—', inline: true },
          { name: 'Disponibilidade', value: data.disponibilidade || '—', inline: false },
          { name: 'Motivo', value: (data.motivo || '—').slice(0, 1000), inline: false },
          { name: 'Como conheceu o clã', value: data.como_conheceu || '—', inline: false }
        ]
      }]
    };
    const res = await fetch(CONFIG.discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Discord respondeu ' + res.status);
  }

  function sendByEmail(data, summary) {
    const subject = encodeURIComponent('Confirmação de Convite — Golden Order (' + (data.nome || '') + ')');
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:${CONFIG.fallbackEmail}?subject=${subject}&body=${body}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formNote.textContent = '';
    formNote.classList.remove('error');

    if (!form.reportValidity()) return;

    const data = collectData();
    const summary = buildSummary(data);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const usingWebhook = !!CONFIG.discordWebhookUrl;

    try {
      if (usingWebhook) {
        await sendToDiscord(data, summary);
        openModal({
          title: 'CONVITE CONFIRMADO!',
          text: 'Sua confirmação chegou até a Golden Order. Fique de olho no Discord — alguém do clã vai te chamar em breve.',
          showSummary: false,
          showCopy: false
        });
        form.reset();
      } else {
        // sem webhook configurado: abre o e-mail do usuário já preenchido
        sendByEmail(data, summary);
        openModal({
          title: 'QUASE LÁ!',
          text: 'Seu app de e-mail deve abrir com a confirmação pronta — é só clicar em enviar. Se nada abrir, copie o resumo abaixo e envie manualmente.',
          showSummary: true,
          summaryText: summary,
          showCopy: true
        });
      }
    } catch (err) {
      formNote.textContent = 'Não deu pra enviar agora. Copie o resumo abaixo e envie pelo Discord do clã.';
      formNote.classList.add('error');
      openModal({
        title: 'ALGO DEU ERRADO',
        text: 'O envio automático falhou. Copie o resumo abaixo e cole no Discord da Golden Order — ninguém vai perder sua confirmação por isso.',
        showSummary: true,
        summaryText: summary,
        showCopy: true
      });
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirmar Entrada';
    }
  });
})();