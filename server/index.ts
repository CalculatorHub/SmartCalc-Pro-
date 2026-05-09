import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Basic Security & Middleware
  app.set("trust proxy", 1);
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(cors());
  app.use(express.json());

  // 2. Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests' }
  });
  app.use('/api/', limiter);

  // 3. API ROUTES
  
  // Finance History (In-memory fallback for complex calculations)
  let financeHistory: any[] = [];

  app.post('/api/finance', (req, res) => {
    const data = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    financeHistory.unshift(data);
    if (financeHistory.length > 50) financeHistory.pop();
    res.json(data);
  });

  app.get('/api/finance', (req, res) => {
    res.json(financeHistory);
  });
  
  // Metal Prices Proxy
  app.get('/api/prices/metals', async (req, res) => {
    // In a real app, this would fetch from an external API like metals-api.com
    // For now, it returns current market rates
    res.json({
      success: true,
      data: { 
        gold24: 8650, 
        gold22: 7930, 
        silver: 115, 
        timestamp: new Date().toISOString() 
      }
    });
  });

  // 4. Vite middleware or Static serving
  const isProd = process.env.NODE_ENV === "production";
  const distPath = path.join(process.cwd(), 'dist');
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server (Hybrid) running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server failed to start:', err);
});

