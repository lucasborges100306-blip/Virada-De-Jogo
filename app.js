document.addEventListener("DOMContentLoaded", () => {
  const chatWindow = document.getElementById("chatWindow");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!chatWindow || !chatInput || !sendBtn) {
    console.error("❌ ERRO: elementos do chat não encontrados");
    return;
  }

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("msg", sender);
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.classList.add("msg", "bot");
    typing.textContent = "Assistente está digitando";

    chatWindow.appendChild(typing);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    let dots = 0;
    typing.interval = setInterval(() => {
      dots = (dots + 1) % 4;
      typing.textContent = "Assistente está digitando" + ".".repeat(dots);
    }, 400);

    return typing;
  }

  function removeTyping(typing) {
    if (!typing) return;
    clearInterval(typing.interval);
    typing.remove();
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";
    sendBtn.disabled = true;

    const typingIndicator = showTyping();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) throw new Error("Erro na resposta");

      const data = await response.json();
      removeTyping(typingIndicator);
      addMessage(data.reply || "Sem resposta da IA.", "bot");

    } catch (error) {
      console.error(error);
      removeTyping(typingIndicator);
      addMessage("❌ Erro ao conectar com o servidor.", "bot");
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  sendBtn.addEventListener("click", sendMessage);

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});
