import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

// =======================
// APP
// =======================
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
// CHAT IA (ANTI APOSTAS)
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
      messages: [
        {
          role: "system",
          content: `
Você é um assistente do projeto "Virada de Jogo".

REGRAS OBRIGATÓRIAS:
- Você NUNCA deve incentivar apostas, jogos de azar ou qualquer tipo de jogo financeiro.
- Você NUNCA deve dar dicas, estratégias, odds ou previsões.
- Se o usuário falar sobre apostas, responda de forma empática, mas SEMPRE desencorajando.
- Seu foco é recuperação emocional, autocontrole e recomeço.
- Seja humano, respeitoso e acolhedor.
- Incentive escolhas saudáveis e buscar ajuda quando necessário.

Você existe para ajudar pessoas a saírem do vício, não para apostar.
          `,
        },
        {
          role: "user",
          content: finalMessage,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("❌ ERRO CHAT:", error);

    if (error?.status === 429) {
      return res.status(429).json({
        error: "Limite da API atingido ou sem créditos.",
      });
    }

    res.status(500).json({
      error: "Erro interno no servidor.",
    });
  }
});

// =======================
// START SERVER (RENDER)
// =======================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
