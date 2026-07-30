// src/components/Practice/practiceData.js

import { Plus, Minus, X, Divide } from "lucide-react";

const practiceData = [
  {
    id: "addition",
    operation: "add",
    title: "Addition",
    icon: Plus,
    description: "Practice combining numbers and improve your mental calculation speed.",
    shortDescription: "Add numbers quickly and accurately.",
  },

  {
    id: "subtraction",
    operation: "sub",
    title: "Subtraction",
    icon: Minus,
    description: "Practice finding the difference between numbers and improve calculation skills.",
    shortDescription: "Subtract numbers with speed and accuracy.",
  },

  {
    id: "multiplication",
    operation: "mul",
    title: "Multiplication",
    icon: X,
    description: "Build multiplication fluency and improve your ability to calculate larger numbers quickly.",
    shortDescription: "Multiply numbers faster through practice.",
  },

  {
    id: "division",
    operation: "div",
    title: "Division",
    icon: Divide,
    description: "Practice dividing numbers and develop stronger number sense.",
    shortDescription: "Improve division speed and accuracy.",
  },
];

export default practiceData;
