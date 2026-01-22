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
// PATH
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
// HEALTH CHECK
// =======================
app.get("/health", (req, res) => {
  res.json({ status: "Servidor online 🚀" });
});

// =======================
// CHAT (ANTI-APOSTA)
// =======================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de apoio. Nunca incentive apostas, jogos de azar ou gambling. Sempre desencoraje apostas e sugira alternativas saudáveis.",
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// =======================
app.listen(PORT, "0.0.0.0", () => {
  console.log("🔥 Servidor rodando");
});
