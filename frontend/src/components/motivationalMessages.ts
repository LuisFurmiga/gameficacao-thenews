// frontend/src/components/motivationalMessages.ts

export const motivationalMessages = {
  good: [
    { message: "🔥 Você está no seu melhor momento! Continue assim!", emoji: "🔥" },
    { message: "💪 Sua streak está incrível! Não pare agora!", emoji: "💪" },
    { message: "🎯 Excelente progresso! Você está no caminho certo!", emoji: "🎯" },
    { message: "🚀 Impressionante! Sua consistência é inspiradora!", emoji: "🚀" }
  ],
  neutral: [
    { message: "📖 Cada dia conta! Continue avançando!", emoji: "📖" },
    { message: "⏳ Continue lendo, sua streak agradece!", emoji: "⏳" },
    { message: "📅 Um dia de cada vez! Persista!", emoji: "📅" }
  ],
  bad: [
    { message: "😢 Você perdeu sua streak. Mas não desista!", emoji: "😢" },
    { message: "💔 Sua streak foi interrompida. Que tal recomeçar?", emoji: "💔" },
    { message: "🔄 Todo mundo falha às vezes. Volte mais forte!", emoji: "🔄" }
  ]
};

export const getRandomMessage = (type: "good" | "neutral" | "bad") => {
  const messages = motivationalMessages[type];
  return messages[Math.floor(Math.random() * messages.length)];
};
