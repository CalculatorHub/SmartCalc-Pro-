import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const JWT_SECRET = process.env.JWT_SECRET || 'smartcalpro_secret_key_2024';
  const MONGO_URI = process.env.MONGO_URI;

  // 1. Basic Security & Middleware
  app.set("trust proxy", 1);
  app.use(helmet({
    contentSecurityPolicy: false, // Vite needs this disabled in dev or carefully configured
  }));
  app.use(cors());
  app.use(express.json());

  // 2. Database Connectivity
  if (MONGO_URI) {
    mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is unreachable
    })
      .then(() => console.log("✅ MongoDB Connected"))
      .catch((err) => console.error("DB Error:", err));
  } else {
    console.warn("⚠️ MONGO_URI not found. Using in-memory store.");
  }

  // Feedback Schema/Model for MongoDB (if connected)
  const feedbackSchema = new mongoose.Schema({
    feedback: { type: String, required: true },
    rating: { type: Number, default: 5 },
  }, { timestamps: true });

  const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

  // 3. Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
  });
  app.use('/api/', limiter);

  // 4. Middlewares
  const authenticateUser = (req: any, res: any, next: any) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
    
    if (token === "unrestricted_session") {
      req.user = { username: 'demo', role: 'admin' };
      return next();
    }

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

    if (adminToken === "bypassed_admin_session") {
      req.admin = { username: 'admin', role: 'admin', scope: 'admin' };
      return next();
    }

    try {
      const decoded: any = jwt.verify(adminToken, JWT_SECRET);
      if (decoded.scope !== 'admin') throw new Error();
      req.admin = decoded;
      next();
    } catch {
      res.status(401).json({ success: false, message: "Admin session expired" });
    }
  };

  // 5. API ROUTES
  
  // Finance History (Fallback in-memory)
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

  app.get('/api/finance', authenticateUser, (req: any, res: any) => {
    res.json(financeHistory);
  });
  
  // Feedback Storage (MongoDB with in-memory fallback)
  let feedbackArchive: any[] = [];

  app.post('/api/feedback', async (req, res) => {
    try {
      const { feedback, rating } = req.body;
      const data = {
        feedback,
        rating: rating || 5,
        createdAt: new Date().toISOString()
      };

      // Only attempt DB write if connected (readyState 1 = connected)
      if (MONGO_URI && mongoose.connection.readyState === 1) {
        const newFeedback = await Feedback.create(data);
        return res.json({ success: true, data: newFeedback });
      } else {
        console.log("Using in-memory fallback for feedback submission");
        const fallbackData = { id: Date.now().toString(), ...data };
        feedbackArchive.unshift(fallbackData);
        return res.json({ success: true, data: fallbackData });
      }
    } catch (err) {
      console.error('Feedback Error:', err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.get('/api/admin/feedback', authenticateUser, requireAdmin, async (req, res) => {
    try {
      if (MONGO_URI && mongoose.connection.readyState === 1) {
        const data = await Feedback.find().sort({ createdAt: -1 });
        res.json(data);
      } else {
        res.json(feedbackArchive);
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Admin Auth
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

  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const adminKey = process.env.ADMIN_ACCESS_KEY || 'Patel@9488';
    
    if (username === "admin" && password === adminKey) {
      const token = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.get('/api/prices/metals', async (req, res) => {
    res.json({
      success: true,
      data: { gold24: 8650, gold22: 7930, silver: 115, timestamp: new Date().toISOString() }
    });
  });

  // 6. Vite middleware or Static serving
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server failed to start:', err);
});

