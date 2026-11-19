import cors from 'cors';
import express from 'express';

const DEFAULT_TIME_ZONE = 'America/Sao_Paulo';

export function createDateTimePayload(
  now = new Date(),
  timeZone = process.env.TIMEZONE || DEFAULT_TIME_ZONE,
) {
  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone,
  });

  const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone,
  });

  return {
    data: dateFormatter.format(now),
    hora: timeFormatter.format(now),
    dataHora: now.toISOString(),
    fusoHorario: timeZone,
  };
}

const app = express();

app.disable('x-powered-by');
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  }),
);
app.use(express.json());

// Página inicial com visual jovem e descolado
app.get('/', (_request, response) => {
  response.send(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="API de data e hora — horário oficial de São Paulo" />
  <title>⏰ Data e Hora — API Express</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Rubik:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Rubik', system-ui, sans-serif;
      background: #0f0f13;
      color: #fff;
      min-height: 100vh;
      overflow-x: hidden;
    }
    .bg-blobs {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
    }
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.45;
      animation: blob-flow 10s ease-in-out infinite;
    }
    .blob-1 { top: -10%; left: -10%; width: 600px; height: 600px; background: #bc13fe; animation-delay: 0s; }
    .blob-2 { bottom: -15%; right: -10%; width: 700px; height: 700px; background: #ff006e; animation-delay: -3s; }
    .blob-3 { top: 35%; left: 40%; width: 500px; height: 500px; background: #8338ec; animation-delay: -6s; opacity: 0.35; }
    @keyframes blob-flow {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(40px, -60px) scale(1.1); }
      66% { transform: translate(-20px, 40px) scale(0.9); }
    }
    .container {
      max-width: 720px;
      margin: 0 auto;
      padding: 80px 20px 120px;
      position: relative;
      z-index: 1;
    }
    header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 60px;
    }
    .eyebrow {
      font-family: 'Permanent Marker', cursive;
      font-size: 1rem;
      color: #bc13fe;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      margin-bottom: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    h1 {
      font-family: 'Permanent Marker', cursive;
      font-size: clamp(2.5rem, 10vw, 4rem);
      line-height: 1;
      margin: 0;
      background: linear-gradient(135deg, #fff 0%, #bc13fe 50%, #8338ec 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
    }
    .sub {
      color: #a1a1aa;
      font-size: 1.1rem;
      margin-top: 16px;
      font-weight: 400;
    }
    .clock-wrap {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 30px;
      padding: 40px 28px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.08);
      backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden;
    }
    .clock-wrap::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, #bc13fe, #ff006e, #8338ec);
      opacity: 0.9;
    }
    .clock-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: center;
    }
    .field { display: flex; flex-direction: column; gap: 8px; }
    .field-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #bc13fe;
      font-weight: 700;
    }
    .field-value {
      font-family: 'Permanent Marker', cursive;
      font-size: clamp(2rem, 8vw, 3.2rem);
      color: #fff;
      text-shadow: 0 0 20px rgba(188, 19, 254, 0.35);
    }
    .divider {
      grid-column: 1 / -1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      margin: 24px 0;
    }
    .api-hint {
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .api-label {
      font-family: 'Permanent Marker', cursive;
      color: #8338ec;
      font-size: 0.95rem;
      letter-spacing: 0.2em;
    }
    .endpoints {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .endpoint {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(131, 56, 236, 0.35);
      border-radius: 14px;
      padding: 10px 18px;
      font-family: 'Rubik', monospace;
      font-size: 0.85rem;
      color: #c7c7d1;
      transition: all 0.2s ease;
    }
    .endpoint:hover {
      border-color: #bc13fe;
      color: #fff;
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(188, 19, 254, 0.25);
    }
    .endpoint code { color: #bc13fe; }
    .refresh-btn {
      margin-top: 28px;
      background: linear-gradient(135deg, #bc13fe, #8338ec);
      border: none;
      border-radius: 16px;
      color: #fff;
      font-family: 'Permanent Marker', cursive;
      font-size: 1.15rem;
      padding: 16px 32px;
      cursor: pointer;
      box-shadow: 0 12px 32px rgba(188, 19, 254, 0.35);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .refresh-btn:hover {
      transform: translateY(-3px) scale(1.03);
      filter: brightness(1.15);
      box-shadow: 0 16px 40px rgba(188, 19, 254, 0.5);
    }
    .refresh-btn:active { transform: translateY(0) scale(0.98); }
    .footer-note {
      margin-top: 50px;
      color: #666672;
      font-size: 0.8rem;
      text-align: center;
      font-family: 'Rubik', sans-serif;
    }
    .live-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #22c55e;
      font-family: 'Rubik', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      margin-bottom: 10px;
    }
    .live-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 12px #22c55e;
      animation: blink 1.2s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }
    @media (max-width: 640px) {
      .clock-grid { grid-template-columns: 1fr; }
      .container { padding: 60px 16px 100px; }
    }
  </style>
</head>
<body>
  <div class="bg-blobs">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>
  <div class="container">
    <header>
      <div class="eyebrow">🚀 API Express · Senai</div>
      <h1>Data e Hora<br>Agora Mesmo</h1>
      <p class="sub">Horário oficial do servidor — fuso de São Paulo 🇧🇷</p>
    </header>
    <div class="live-indicator">
      <div class="live-dot"></div>
      <span>API online e respondendo</span>
    </div>
    <div class="clock-wrap">
      <div class="clock-grid">
        <div class="field">
          <p class="field-label">Horário</p>
          <time id="hora" class="field-value">--:--:--</time>
        </div>
        <div class="field">
          <p class="field-label">Data</p>
          <time id="data" class="field-value">--/--/----</time>
        </div>
        <div class="divider"></div>
        <div class="field" style="grid-column: 1 / -1;">
          <p class="field-label">Fuso horário</p>
          <time id="fuso" class="field-value">America/Sao_Paulo</time>
        </div>
      </div>
    </div>
    <div class="api-hint">
      <div class="api-label">Endpoints da API</div>
      <div class="endpoints">
        <div class="endpoint">GET <code>/api/data-hora</code></div>
        <div class="endpoint">GET <code>/api/saude</code></div>
      </div>
      <button class="refresh-btn" onclick="atualizar()">↻ Atualizar agora</button>
    </div>
    <p class="footer-note">Feito com ⚡ para a disciplina de Frameworks Front-end · Senai</p>
  </div>
  <script>
    async function atualizar() {
      try {
        const r = await fetch('/api/data-hora', { cache: 'no-store' });
        const j = await r.json();
        document.getElementById('hora').textContent = j.hora;
        document.getElementById('data').textContent = j.data;
        document.getElementById('fuso').textContent = j.fusoHorario;
      } catch (e) { console.error(e); }
    }
    setInterval(atualizar, 1000);
    atualizar();
  </script>
</body>
</html>`);
});

app.get('/api/data-hora', (_request, response) => {
  response.set('Cache-Control', 'no-store');
  response.json(createDateTimePayload());
});

app.get('/api/saude', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use((_request, response) => {
  response.status(404).json({ erro: 'Rota nao encontrada.' });
});

export default app;
