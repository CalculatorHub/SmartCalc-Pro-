import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Basic Security & Middleware
  app.use(cors());
  app.use(express.json());

  // 2. Rate Limiting (Prevent abuse)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
  });
  app.use('/api/', limiter);

  // 3. SECURE API ROUTES (Backend Proxy)
  
  // Finance History Store (In-memory for demo)
  let financeHistory: any[] = [];

  app.post('/api/finance', (req, res) => {
    const data = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    financeHistory.unshift(data);
    // Keep only last 50 items
    if (financeHistory.length > 50) financeHistory.pop();
    res.json(data);
  });

  app.get('/api/finance', (req, res) => {
    res.json(financeHistory);
  });
  
  // Admin Authentication
  app.post('/api/admin/auth', (req, res) => {
    const { key } = req.body;
    const adminKey = process.env.ADMIN_ACCESS_KEY || 'Patel@9488';
    
    if (key === adminKey) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid Key' });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    // Simple demo logic - using the same key as password for consistency
    const adminKey = process.env.ADMIN_ACCESS_KEY || 'Patel@9488';
    if (username === "admin" && password === adminKey) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Example: Secure Gold/Silver Price Proxy (Hides API Key from Frontend)
  app.get('/api/prices/metals', async (req, res) => {
    try {
      // In a real scenario, you'd get this from an actual third-party API
      // const API_KEY = process.env.METALS_API_KEY;
      // const response = await fetch(`https://api.metals.live/v1/latest?api_key=${API_KEY}`);
      // const data = await response.json();
      
      // For now, we simulate a secure response that would normally require a key
      res.json({
        success: true,
        data: {
          gold24: 8650,
          gold22: 7930,
          silver: 115,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Proxy Error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch metal prices' });
    }
  });

  // 4. Vite middleware or Static serving
  const isProd = process.env.NODE_ENV === "production";
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 5. Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server failed to start:', err);
});
