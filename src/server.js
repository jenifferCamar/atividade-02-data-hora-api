import app from './app.js';

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`API disponivel em http://localhost:${port}`);
});

function shutDown(signal) {
  console.log(`${signal} recebido. Encerrando o servidor...`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutDown('SIGINT'));
process.on('SIGTERM', () => shutDown('SIGTERM'));
