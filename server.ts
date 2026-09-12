import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { app } from './serverApp';

const PORT = 3000;

/* ==========================================================================
   VITE MIDDLEWARE / PRODUCTION STATIC FALLBACK
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOORBAL Commerce Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
