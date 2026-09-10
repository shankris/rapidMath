// src/components/Practice/practiceData.js

import { Plus, Minus, X, Divide, Calculator, Search, ArrowLeftRight, ListOrdered, Sigma, Percent } from "lucide-react";

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

  {
    id: "mixed-operations",
    operation: "mixedOperations",
    title: "Mixed Operations",
    icon: Calculator,
    description: "Combine addition, subtraction, multiplication, and division while applying order of operations.",
    shortDescription: "Solve mixed expressions with speed and accuracy.",
  },

  {
    id: "missing-number",
    operation: "missingNumber",
    title: "Missing Number",
    icon: Search,
    description: "Find the missing number and strengthen your mental calculation and problem-solving skills.",
    shortDescription: "Find missing numbers quickly and accurately.",
  },

  {
    id: "comparison",
    operation: "comparison",
    title: "Comparison",
    icon: ArrowLeftRight,
    description: "Compare calculated values and strengthen your mental math and number sense.",
    shortDescription: "Compare numbers and expressions quickly.",
  },

  {
    id: "estimation",
    operation: "estimation",
    title: "Estimation",
    icon: Calculator,
    description: "Estimate calculations quickly using rounding and number sense.",
    shortDescription: "Estimate calculations quickly.",
  },

  {
    id: "sequences",
    operation: "sequences",
    title: "Sequences & Progressions",
    icon: ListOrdered,
    description: "Find patterns and predict the next number in a sequence.",
    shortDescription: "Find patterns and predict what comes next.",
  },
  {
    id: "fractions",
    operation: "fractions",
    title: "Fractions",
    icon: Sigma,
    description: "Practice simplifying, comparing, and calculating with fractions.",
    shortDescription: "Build speed and accuracy with fractions.",
  },
  {
    id: "percentages",
    operation: "percentages",
    title: "Percentages",
    icon: Percent,
    description: "Practice percentage calculations and improve your ability to work with percentages quickly and accurately.",
    shortDescription: "Calculate percentages quickly and accurately.",
  },
];

export default practiceData;
