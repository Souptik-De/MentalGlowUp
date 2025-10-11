export const inspirationalQuotes = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.",
  "Happiness is not by chance, but by choice.",
  "Every day may not be good, but there's something good in every day.",
  "The best time for new beginnings is now.",
  "You are stronger than you think.",
  "Progress, not perfection.",
  "Small steps every day lead to big changes.",
  "Be patient with yourself. Growth takes time.",
  "Your mental health is a priority, not a luxury.",
  "It's okay to not be okay sometimes.",
  "You deserve the same kindness you give to others.",
  "Healing is not linear.",
  "Take it one breath at a time.",
];

export const getRandomQuote = (): string => {
  return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
};
