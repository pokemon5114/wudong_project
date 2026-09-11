import { Bootstrap } from '@midwayjs/bootstrap';
import * as net from 'node:net';

const serverPort = Number(process.env.PORT) || 8001;

function canConnect(host: string, port: number, timeoutMs = 500) {
  return new Promise<boolean>(resolve => {
    const socket = net.createConnection({ host, port });
    const finish = (available: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(available);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

async function start() {
  // Redis is an optional acceleration layer. When Docker/Redis is not running,
  // disable it before Midway creates any services so local startup remains
  // deterministic and the application uses its database fallback.
  const redisMode = process.env.REDIS_ENABLED?.toLowerCase();
  if (!redisMode || redisMode === 'auto') {
    const redisAvailable = await canConnect(process.env.REDIS_HOST || '127.0.0.1', Number(process.env.REDIS_PORT) || 6379);
    if (!redisAvailable) {
      process.env.REDIS_ENABLED = 'false';
      console.warn('[wudong] Redis unavailable; using database fallback (set REDIS_ENABLED=true when Redis is running).');
    }
  }

  // Avoid a noisy Midway EADDRINUSE stack trace when the local service is
  // already running. A second `npm run dev` becomes a harmless no-op.
  if (await canConnect('127.0.0.1', serverPort)) {
    console.warn(`[wudong] port ${serverPort} is already in use; the existing server will be reused.`);
    return;
  }

  await Bootstrap.run();
}

start().catch(error => {
  console.error('[wudong] failed to start server:', error);
  process.exitCode = 1;
});
