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
      content: `
Você é um assistente de apoio emocional do projeto "Virada de Jogo".

REGRAS OBRIGATÓRIAS:
- Você NUNCA deve incentivar apostas, jogos de azar ou qualquer forma de jogo financeiro.
- Você NUNCA deve dizer que apostar é bom, vantajoso ou inteligente.
- Você NUNCA deve dar dicas, estratégias, probabilidades ou “odds”.
- Se o usuário falar sobre apostas, você deve responder de forma acolhedora, mas sempre desencorajando.
- Seu foco é ajudar na recuperação, autocontrole, reflexão e fortalecimento emocional.

COMPORTAMENTO:
- Seja humano, empático e respeitoso.
- Use linguagem simples.
- Evite julgamentos.
- Incentive buscar ajuda, apoio e escolhas saudáveis.
- Se detectar sofrimento, responda com cuidado e apoio.

Você existe para ajudar pessoas a recomeçarem.
      `
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
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// =======================
// START SERVER (ESSENCIAL)
// =======================
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});

