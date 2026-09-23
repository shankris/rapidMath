// src/components/Shortcuts/Multiplication/shortcuts.js

const multiplicationShortcuts = {
  title: "Multiplication",

  categories: [
    // --------------------------------------------------
    // Two-Digit Multiplication
    // --------------------------------------------------
    {
      id: "two-digit-multiplication",
      title: "Two-Digit Multiplication",
      shortcuts: [
        {
          id: "two-digit-multiplication",
          title: "Two-Digit Multiplication",
          subtitle: "Break the multiplication into smaller parts and work from right to left.",
          content: "Multiply two-digit numbers using either the Right to Left method or the Three Blocks method. Both methods split the calculation into manageable products and handle carries from right to left.",
          component: "TwoDigitMultiplication",
        },
      ],
    },
  ],
};

export default multiplicationShortcuts;
