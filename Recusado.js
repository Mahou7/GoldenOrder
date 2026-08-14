/* Golden Order — avisa no mesmo canal do Discord usado pelas confirmações
   (ver form.js) quando alguém CONFIRMA que recusa o convite. Diferente da
   versão anterior, o aviso não dispara mais sozinho ao abrir a página —
   só depois que a pessoa digita o nick e confirma no formulário abaixo,
   assim dá pra saber quem exatamente recusou.

   Usa a MESMA URL de webhook configurada em form.js. Se você trocar o
   webhook lá, troque aqui também. */
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1537605741245112440/xxUxl4x-vOA--44Az7Q3q-3hJKXSeIGb---qtt1VB47RFeTR4PLhyx2kxmkRnZv5ueLH';

(function () {
  const form = document.getElementById('recusadoForm');
  const nickInput = document.getElementById('fNickRecusa');
  const confirmBtn = document.getElementById('confirmRecusaBtn');
  const step1 = document.getElementById('recusadoStep1');
  const step2 = document.getElementById('recusadoStep2');
  if (!form || !nickInput || !confirmBtn || !step1 || !step2) return;

  const params = new URLSearchParams(window.location.search);
  const name = (params.get('para') || '').trim().slice(0, 40);

  function showFarewell() {
    step1.hidden = true;
    step2.hidden = false;
  }

  function resetToStart() {
    step1.hidden = false;
    step2.hidden = true;
    confirmBtn.disabled = false;
    form.reset();
  }

  // sempre volta pro passo do nick ao (re)carregar a página — inclusive
  // quando o navegador restaura a página do cache (bfcache) ao voltar
  // pelo botão "voltar", em vez de manter a mensagem de despedida de
  // uma visita anterior
  window.addEventListener('pageshow', resetToStart);

  function notifyDecline(nick) {
    if (!DISCORD_WEBHOOK_URL) return Promise.resolve();

    const payload = {
      username: 'Golden Order — Convites',
      embeds: [{
        title: 'Convite recusado',
        color: 9807270, // cinza — diferencia visualmente das confirmações (douradas)
        fields: [
          { name: 'Nick no jogo', value: nick || '—', inline: true },
          { name: 'Nome', value: name || '—', inline: true }
        ]
      }]
    };

    return fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // silencioso de propósito: a pessoa já decidiu recusar, não faz
      // sentido travá-la numa página de despedida por causa de um erro
      // técnico de envio — ela segue pra mensagem final de qualquer jeito
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const nick = nickInput.value.trim();
    confirmBtn.disabled = true;

    notifyDecline(nick).finally(showFarewell);
  });
})();