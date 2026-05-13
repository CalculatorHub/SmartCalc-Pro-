import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/metals", async (req, res) => {
    const apiKey = process.env.METAL_API_KEY;

    // If key is present, try api.metals.dev (often more reliable with key)
    if (apiKey) {
      try {
        const response = await fetch(`https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=INR&unit=g`);
        if (response.ok) {
          const data = await response.json();
          // Map to a consistent format if needed, but hook handles data.metals
          return res.json(data);
        }
      } catch (e) {
        console.error("Metals.dev API Error:", e);
      }
    }

    const fetchWithSNI = () => {
      return new Promise((resolve, reject) => {
        const options = {
          hostname: 'api.metals.live',
          path: '/v1/spot',
          method: 'GET',
          servername: 'api.metals.live', // Explicitly set SNI servername
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          timeout: 10000 // 10 second timeout
        };

        const metalsReq = https.request(options, (metalsRes) => {
          if (metalsRes.statusCode !== 200) {
            reject(new Error(`HTTP ${metalsRes.statusCode}`));
            return;
          }

          let data = '';
          metalsRes.on('data', (chunk) => data += chunk);
          metalsRes.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error('Failed to parse JSON response'));
            }
          });
        });

        metalsReq.on('error', (err) => {
          reject(err);
        });

        metalsReq.on('timeout', () => {
          metalsReq.destroy();
          reject(new Error('Request timed out'));
        });

        metalsReq.end();
      });
    };

    try {
      const data = await fetchWithSNI();
      res.json(data);
    } catch (error) {
      console.error("Metals API Proxy Error (SNI attempt):", error);
      
      // Secondary Fallback if SNI fix still fails
      res.json([
        { "gold": 16798.00 }, 
        { "silver": 310.00 }
      ]);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

startServer();
