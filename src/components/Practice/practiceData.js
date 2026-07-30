import { Plus, Minus, X, Divide } from "lucide-react";

const practiceData = [
  {
    id: "addition",
    title: "Addition",
    icon: Plus,
    levels: [
      { level: 1, attempts: 20, accuracy: "95%" },
      { level: 2, attempts: 12, accuracy: "87%" },
      { level: 3, attempts: 0, accuracy: "New" },
      { level: 4, attempts: 0, accuracy: "New" },
    ],
  },

  {
    id: "subtraction",
    title: "Subtraction",
    icon: Minus,
    levels: [
      { level: 1, attempts: 15, accuracy: "92%" },
      { level: 2, attempts: 8, accuracy: "84%" },
      { level: 3, attempts: 0, accuracy: "New" },
      { level: 4, attempts: 0, accuracy: "New" },
    ],
  },

  {
    id: "multiplication",
    title: "Multiplication",
    icon: X,
    levels: [
      { level: 1, attempts: 10, accuracy: "90%" },
      { level: 2, attempts: 6, accuracy: "82%" },
      { level: 3, attempts: 0, accuracy: "New" },
      { level: 4, attempts: 0, accuracy: "New" },
    ],
  },

  {
    id: "division",
    title: "Division",
    icon: Divide,
    levels: [
      { level: 1, attempts: 5, accuracy: "88%" },
      { level: 2, attempts: 0, accuracy: "New" },
      { level: 3, attempts: 0, accuracy: "New" },
      { level: 4, attempts: 0, accuracy: "New" },
    ],
  },
];

export default practiceData;
