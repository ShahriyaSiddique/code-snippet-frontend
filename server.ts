import express from 'express';
import { resolve } from 'node:path';

// Client-only: serve static browser build. SPA fallback to index.html.
export function app(): express.Express {
  const server = express();
  // Client-only build: output is dist/code-gist-frontend/browser when run from project root
  const browserDistFolder = resolve(process.cwd(), 'dist/code-gist-frontend/browser');

  server.use(express.static(browserDistFolder, { maxAge: '1y' }));
  server.get('*', (_req, res) => {
    res.sendFile(resolve(browserDistFolder, 'index.html'));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
