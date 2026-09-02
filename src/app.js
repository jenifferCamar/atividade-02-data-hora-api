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

app.get('/', (_request, response) => {
  response.json({
    mensagem: 'API de data e hora em funcionamento.',
    endpoint: '/api/data-hora',
  });
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
