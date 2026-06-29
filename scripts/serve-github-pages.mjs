#!/usr/bin/env node
/**
 * Simulates GitHub Pages hosting at /JidelnicekIO for local testing.
 * Usage: node scripts/serve-github-pages.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const BASE = '/JidelnicekIO';
const PORT = Number(process.env.PORT) || 8081;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFile(urlPath) {
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(DIST, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  if (!path.extname(filePath) && fs.existsSync(`${filePath}.html`)) {
    return `${filePath}.html`;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  const notFound = path.join(DIST, '+not-found.html');
  return fs.existsSync(notFound) ? notFound : null;
}

const server = http.createServer((req, res) => {
  const rawUrl = req.url ?? '/';
  const pathname = rawUrl.split('?')[0];

  if (pathname === '/') {
    res.writeHead(302, { Location: `${BASE}/` });
    res.end();
    return;
  }

  if (!pathname.startsWith(BASE)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found. Open http://localhost:' + PORT + BASE + '/');
    return;
  }

  const relative = pathname.slice(BASE.length) || '/';
  const file = resolveFile(relative);

  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(file);
  res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`GitHub Pages preview: http://localhost:${PORT}${BASE}/`);
  console.log(`Serving files from: ${DIST}`);
});
