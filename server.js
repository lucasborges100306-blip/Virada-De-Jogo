import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

// ✅ APP TEM QUE EXISTIR
const app = express();

// ✅ PORTA DO RENDER
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
// ARQUIVOS ESTÁTICOS
// =======================
app.use(express.static(__dirname));

// =======================
// OPENAI
// =======================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =======================
// HEALTH CHECK
// =======================
app.get("/health", (req, res) => {
  res.json({ status: "Servidor online 🚀" });
});

// =======================
// CHAT
// =======================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem vazia." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de apoio emocional. Nunca incentive apostas, jogos de azar ou qualquer tipo de betting. Ajude sempre a sair do vício.",
        },
        {
          role: "user",
          content: message,
        },
      ],
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
// START SERVER (ESSENCIAL)
// =======================
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});

