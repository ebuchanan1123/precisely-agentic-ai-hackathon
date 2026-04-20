import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import evaluateRouter from './routes/evaluate.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const app = express();
const port = process.env.PORT || 4000;
const serverDir = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(serverDir, '..', '..', 'client', 'dist');
const hasClientBuild = existsSync(path.join(clientDistPath, 'index.html'));

const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '1mb' }));
app.use('/api', evaluateRouter);

app.get('/api/health', (_req, res) => {
  res.send({ status: 'server running' });
});

if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.send({ status: 'server running', clientBuild: false });
  });
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
