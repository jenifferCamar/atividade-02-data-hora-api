import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';

import app, { createDateTimePayload } from '../src/app.js';

test('formata uma data conhecida no fuso de Sao Paulo', () => {
  const payload = createDateTimePayload(
    new Date('2026-09-02T15:34:56.000Z'),
    'America/Sao_Paulo',
  );

  assert.deepEqual(payload, {
    data: '02/09/2026',
    hora: '12:34:56',
    dataHora: '2026-09-02T15:34:56.000Z',
    fusoHorario: 'America/Sao_Paulo',
  });
});

test('GET /api/data-hora retorna a data e a hora atuais', async (context) => {
  const server = app.listen(0);
  await once(server, 'listening');
  context.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/data-hora`,
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(body.data, /^\d{2}\/\d{2}\/\d{4}$/);
  assert.match(body.hora, /^\d{2}:\d{2}:\d{2}$/);
  assert.equal(body.fusoHorario, 'America/Sao_Paulo');
  assert.equal(Number.isNaN(Date.parse(body.dataHora)), false);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('uma rota inexistente retorna 404', async (context) => {
  const server = app.listen(0);
  await once(server, 'listening');
  context.after(() => server.close());

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/nao-existe`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, { erro: 'Rota nao encontrada.' });
});
