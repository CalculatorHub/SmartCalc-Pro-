import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const JWT_SECRET = process.env.JWT_SECRET || 'smartcalpro_secret_key_2024';

  // 1. Basic Security & Middleware
  app.set("trust proxy", 1);
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

  // 2. Middlewares
  const authenticateUser = (req: any, res: any, next: any) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ success: false, message: "Invalid session" });
    }
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    const adminToken = req.headers['x-admin-token'] as string;
    if (!adminToken) return res.status(401).json({ success: false, message: "Admin token missing" });
    try {
      const decoded: any = jwt.verify(adminToken, JWT_SECRET);
      if (decoded.scope !== 'admin') throw new Error();
      req.admin = decoded;
      next();
    } catch {
      res.status(401).json({ success: false, message: "Admin session expired" });
    }
  };

  // 3. SECURE API ROUTES
  
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

  app.get('/api/finance', authenticateUser, (req: any, res: any) => {
    res.json(financeHistory);
  });
  
  // Feedback Storage
  let feedbackArchive: any[] = [];

  app.post('/api/feedback', (req, res) => {
    const data = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    feedbackArchive.unshift(data);
    res.json({ success: true, data });
  });

  app.get('/api/admin/feedback', authenticateUser, requireAdmin, (req, res) => {
    res.json(feedbackArchive);
  });

  // Admin Step-Up (Requires valid user session)
  app.post("/api/admin/step-up", authenticateUser, async (req: any, res: any) => {
    const { password } = req.body;
    const adminKey = process.env.ADMIN_ACCESS_KEY || 'Patel@9488';

    if (password === adminKey) {
      const adminToken = jwt.sign(
        { id: req.user.id, username: 'admin', role: 'admin', scope: 'admin' }, 
        JWT_SECRET, 
        { expiresIn: '5m' }
      );
      res.json({ success: true, adminToken });
    } else {
      res.status(401).json({ success: false, message: "Invalid Access Key" });
    }
  });

  // Main Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const adminKey = process.env.ADMIN_ACCESS_KEY || 'Patel@9488';
    
    // In a real app we would store the hash in a DB
    // For this context, we check against the config key
    if (username === "admin" && password === adminKey) {
      const token = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ success: true, token });
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
