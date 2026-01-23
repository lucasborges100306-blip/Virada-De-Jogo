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
- Nunca incentive apostas ou jogos de azar.
- Nunca diga que apostar é bom ou vantajoso.
- Nunca dê dicas, odds ou estratégias.
- Sempre desencoraje apostas com empatia.
- Foque em autocontrole, recuperação e apoio emocional.

COMPORTAMENTO:
- Seja humano, empático e respeitoso.
- Linguagem simples.
- Sem julgamentos.
- Incentive ajuda e escolhas saudáveis.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("❌ ERRO CHAT:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});


  } catch (error) {
    console.error("❌ ERRO CHAT:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});
