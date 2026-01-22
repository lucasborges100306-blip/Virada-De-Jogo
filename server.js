import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;

// =======================
// CONFIG BÁSICA
// =======================
app.use(cors()); // 🔥 IMPORTANTE: evita erro do botão não enviar
app.use(express.json());

// =======================
// CAMINHOS
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// ARQUIVOS ESTÁTICOS (HTML, CSS, JS, IMG, VIDEO)
// =======================
app.use(express.static(__dirname));

// =======================
// OPENAI
// =======================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =======================
// ROTA TESTE
// =======================
app.get("/health", (req, res) => {
  res.json({ status: "Servidor online 🚀" });
});

// =======================
// CHAT IA (POST)
// =======================
app.post("/api/chat", async (req, res) => {
  try {
    const { message, userMessage } = req.body;

    // Aceita os dois formatos (não quebra seu front)
    const finalMessage = message || userMessage;

    if (!finalMessage) {
      return res.status(400).json({
        error: "Mensagem vazia.",
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
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
// START SERVER
// =======================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
//   // 🔹 Mostrar indicador de digitando
