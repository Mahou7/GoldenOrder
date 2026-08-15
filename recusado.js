/* Golden Order — avisa no mesmo canal do Discord usado pelas confirmações
   (ver form.js) quando alguém CONFIRMA que recusa o convite. O aviso não
   dispara sozinho ao abrir a página, nem só por preencher o nick — tem
   um passo extra de "tem certeza?" entre o formulário e o envio de
   verdade, pra evitar recusa por engano (ver recusadoStepWarn no html).

   Usa a MESMA URL de webhook configurada em form.js. Se você trocar o
   webhook lá, troque aqui também. */
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1537605741245112440/xxUxl4x-vOA--44Az7Q3q-3hJKXSeIGb---qtt1VB47RFeTR4PLhyx2kxmkRnZv5ueLH';

(function () {
  const form = document.getElementById('recusadoForm');
  const nickInput = document.getElementById('fNickRecusa');
  const confirmBtn = document.getElementById('confirmRecusaBtn');
  const warnBackBtn = document.getElementById('warnBackBtn');
  const warnConfirmBtn = document.getElementById('warnConfirmBtn');
  const step1 = document.getElementById('recusadoStep1');
  const stepWarn = document.getElementById('recusadoStepWarn');
  const step2 = document.getElementById('recusadoStep2');
  if (!form || !nickInput || !confirmBtn || !warnBackBtn || !warnConfirmBtn || !step1 || !stepWarn || !step2) return;

  const params = new URLSearchParams(window.location.search);
  const name = (params.get('para') || '').trim().slice(0, 40);

  function showWarn() {
    step1.hidden = true;
    stepWarn.hidden = false;
  }

  function showFarewell() {
    stepWarn.hidden = true;
    step2.hidden = false;
  }

  function resetToStart() {
    step1.hidden = false;
    stepWarn.hidden = true;
    step2.hidden = true;
    confirmBtn.disabled = false;
    warnConfirmBtn.disabled = false;
    warnBackBtn.disabled = false;
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

  // passo 1 -> passo de aviso: só valida o nick e mostra o "tem
  // certeza?". Nada é enviado ainda aqui.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    showWarn();
  });

  // "Voltar" no aviso: desiste e volta pro formulário, mantendo o nick
  // já digitado
  warnBackBtn.addEventListener('click', () => {
    if (window.GoldenOrderSound) window.GoldenOrderSound.play('tap');
    stepWarn.hidden = true;
    step1.hidden = false;
  });

  // "Sim, Recusar": só agora, de fato, dispara o aviso no Discord
  warnConfirmBtn.addEventListener('click', () => {
    if (window.GoldenOrderSound) window.GoldenOrderSound.play('decline');
    const nick = nickInput.value.trim();
    warnConfirmBtn.disabled = true;
    warnBackBtn.disabled = true;

    notifyDecline(nick).finally(showFarewell);
  });
})();