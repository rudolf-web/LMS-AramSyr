import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize GoogleGenAI client utility on the server
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_FOR_LOCAL_BUILD",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // JSON body parser
  app.use(express.json());

  // API route for Aramaic AI Bot chat helper
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY belum terkonfigurasi. Silakan masuk ke panel Secrets di AI Studio." 
        });
      }

      // Configure system instruction for high calibration learning of Aramaic/Syriac language
      const systemInstruction = `You are "Asisten AI Aramaik" (Aramaic AI Assistant), a highly knowledgeable, friendly, and expert tutor in Aramaic / Syriac (Kaldania / Suryaya / Asyuria).
Your primary target in teaching:
- Help users learn Aramaic vocabulary, grammar (Tata Bahasa), pronunciation/phonology, and script calligraphy.
- Help translate sentences or phrases from Indonesian to Aramaic/Syriac and vice versa. Always provide:
  1. The Aramaic script (Syriac unicode text in Estrangelo/Serto/Madnkhaya dialects if relevant).
  2. The transliteration (cara baca) so it is easy to pronounce.
  3. The meaning (arti kata) explaining individual roots or words.
- Explain the beautiful history of the Aramaic language, from Biblical Aramaic, Classical Syriac (Peshitta), to Neo-Aramaic dialects spoken today.
- Respond in Indonesian language clearly, with high cultural respect, and scholarly accuracy. Keep descriptions tidy and simple, formatting Syriac characters clearly. Avoid system/terminal-like language. Make the user feel encouraged!`;

      // Format chat history for @google/genai SDK chats if history is provided
      let contents: any[] = [];
      if (history && Array.isArray(history)) {
        contents = history.map(item => ({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content }]
        }));
      }
      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "Mohon maaf, saya tidak dapat memahami teks saat ini. Silakan coba lagi.";
      res.json({ reply });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan di server." });
    }
  });

  // Vite middleware for development vs static asset serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
