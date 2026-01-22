import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// CONFIG
// =======================
app.use(cors());
app.use(express.json());

// =======================
// PATHS
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// STATIC FILES
// =======================
app.use(express.static(__dirname));

// =======================
// OPENAI
// =======================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =======================
// HEALTH
// =======================
app.get("/health", (req, res) => {
  res.json({ status: "Servidor online 🚀" });
});

// =======================
// CHAT
// =======================
app.post("/api/chat", async (req, res) => {
  try {
    const { message, userMessage } = req.body;
    const finalMessage = message || userMessage;

    if (!finalMessage) {
      return res.status(400).json({ error: "Mensagem vazia." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: finalMessage }],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("❌ ERRO CHAT:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// =======================
// START
// =======================
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
