import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // SMS Notification Endpoint (Mock for Africa's Talking / Twilio)
  app.post("/api/notify/sms", async (req, res) => {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ error: "Phone and message are required" });
    }

    console.log(`[SMS MOCK] Sending to ${phone}: ${message}`);

    // Example for Africa's Talking (if configured)
    /*
    try {
      const response = await axios.post('https://api.africastalking.com/version1/messaging', 
        new URLSearchParams({
          username: process.env.AFRICASTALKING_USERNAME!,
          to: phone,
          message: message,
          from: process.env.AFRICASTALKING_SENDER_ID!
        }), {
          headers: {
            'apiKey': process.env.AFRICASTALKING_API_KEY!,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );
      return res.json({ success: true, data: response.data });
    } catch (error) {
      console.error('SMS Error:', error);
      return res.status(500).json({ error: "Failed to send SMS" });
    }
    */

    // For now, return success mock
    res.json({ success: true, message: "SMS sent successfully (mock)" });
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
