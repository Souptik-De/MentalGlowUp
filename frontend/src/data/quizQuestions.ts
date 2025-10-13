export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    value: number;
  }[];
}

export const quizQuestions: Question[] = [
  {
    id: 1,
    text: "Over the past two weeks, how often have you felt happy and content?",
    options: [
      { text: "Nearly every day", value: 4 },
      { text: "More than half the days", value: 3 },
      { text: "Several days", value: 2 },
      { text: "Not at all", value: 1 },
    ],
  },
  {
    id: 2,
    text: "How well have you been sleeping recently?",
    options: [
      { text: "Very well - I feel rested", value: 4 },
      { text: "Pretty well most nights", value: 3 },
      { text: "Not great - some restless nights", value: 2 },
      { text: "Poorly - I'm often tired", value: 1 },
    ],
  },
  {
    id: 3,
    text: "How connected do you feel to friends and family?",
    options: [
      { text: "Very connected and supported", value: 4 },
      { text: "Somewhat connected", value: 3 },
      { text: "A little disconnected", value: 2 },
      { text: "Very isolated or alone", value: 1 },
    ],
  },
  {
    id: 4,
    text: "How well are you managing daily stress?",
    options: [
      { text: "I handle stress very well", value: 4 },
      { text: "I manage most of the time", value: 3 },
      { text: "I struggle sometimes", value: 2 },
      { text: "I feel overwhelmed often", value: 1 },
    ],
  },
  {
    id: 5,
    text: "How would you rate your energy levels?",
    options: [
      { text: "High energy, feeling motivated", value: 4 },
      { text: "Good energy most days", value: 3 },
      { text: "Low energy, often tired", value: 2 },
      { text: "Exhausted, no motivation", value: 1 },
    ],
  },
  {
    id: 6,
    text: "How often do you engage in activities you enjoy?",
    options: [
      { text: "Regularly - several times a week", value: 4 },
      { text: "Sometimes - once or twice a week", value: 3 },
      { text: "Rarely - maybe once a month", value: 2 },
      { text: "Almost never", value: 1 },
    ],
  },
  {
    id: 7,
    text: "How comfortable are you expressing your emotions?",
    options: [
      { text: "Very comfortable - I express myself freely", value: 4 },
      { text: "Somewhat comfortable with close ones", value: 3 },
      { text: "I find it difficult to open up", value: 2 },
      { text: "I keep my feelings to myself", value: 1 },
    ],
  },
  {
    id: 8,
    text: "How often do you feel anxious or worried?",
    options: [
      { text: "Rarely or never", value: 4 },
      { text: "Occasionally, but manageable", value: 3 },
      { text: "Often - it affects my day", value: 2 },
      { text: "Almost constantly", value: 1 },
    ],
  },
  {
    id: 9,
    text: "How positive do you feel about your future?",
    options: [
      { text: "Very hopeful and optimistic", value: 4 },
      { text: "Generally positive", value: 3 },
      { text: "Uncertain or worried", value: 2 },
      { text: "Pessimistic or hopeless", value: 1 },
    ],
  },
  {
    id: 10,
    text: "How well do you practice self-care?",
    options: [
      { text: "I prioritize it regularly", value: 4 },
      { text: "I try to when I can", value: 3 },
      { text: "I struggle to make time", value: 2 },
      { text: "I rarely think about it", value: 1 },
    ],
  },
];
