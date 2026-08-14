/* Golden Order — formulário de ingresso.
   ============================================================
   CONFIGURAÇÃO — Webhook do Discord (é só isso que falta pra cada
   resposta do questionário cair de verdade, automaticamente, num
   canal do seu servidor):

     1. No Discord, entre no canal onde as respostas devem chegar
        (pode ser um canal privado, só a staff vê).
     2. Configurações do Canal (a engrenagem) > Integrações > Webhooks
        > Novo Webhook.
     3. Dê um nome a ele (ex.: "Convites Golden Order"), clique em
        "Copiar URL do Webhook".
     4. Cole essa URL abaixo, entre as aspas de discordWebhookUrl.

   Depois de colar a URL, salve o arquivo e é isso — está funcionando.
   Cada envio do formulário vira uma mensagem nesse canal, com todos
   os campos organizados. As mensagens ficam salvas no histórico do
   canal como qualquer outra, então dá pra rolar, buscar ou fixar as
   que quiser revisar depois.

   Sem essa URL preenchida, o formulário cai automaticamente no modo
   de segurança: abre o e-mail do usuário com tudo preenchido, pra
   garantir que nenhuma resposta se perca enquanto o webhook não é
   configurado.
   ============================================================ */
const CONFIG = {
  discordWebhookUrl: 'https://discord.com/api/webhooks/1537605741245112440/xxUxl4x-vOA--44Az7Q3q-3hJKXSeIGb---qtt1VB47RFeTR4PLhyx2kxmkRnZv5ueLH',
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
      idade: 'Idade',
      nick_minecraft: 'Nick no jogo',
      nome: 'Nome',
      discord: 'Discord',
      sobre_voce: 'Sobre'
    };
    return map[name] || name;
  }

  function collectData() {
    const fd = new FormData(form);
    const data = {};
    for (const [key, value] of fd.entries()) {
      data[key] = value;
    }
    return data;
  }

  function buildSummary(data) {
    const order = ['idade', 'nick_minecraft', 'nome', 'discord', 'sobre_voce'];
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
          { name: 'Idade', value: data.idade || '—', inline: true },
          { name: 'Nick no jogo', value: data.nick_minecraft || '—', inline: true },
          { name: 'Nome', value: data.nome || '—', inline: true },
          { name: 'Discord', value: data.discord || '—', inline: true },
          { name: 'Sobre', value: (data.sobre_voce || '—').slice(0, 1000), inline: false }
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