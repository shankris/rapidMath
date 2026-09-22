// src/components/Shortcuts/PowerRoots/shortcuts.js

const powerRootsShortcuts = {
  title: "Power & Roots",

  categories: [
    // --------------------------------------------------
    // Squares
    // --------------------------------------------------
    {
      id: "squares",
      title: "Squares",
      shortcuts: [
        {
          id: "essentials",
          title: "Essentials",
          component: "Essentials",
        },
        {
          id: "two-digit-squares",
          title: "Two-Digit Squares",
          component: "TwoDigitSquares",
        },
        {
          id: "three-digit-squares",
          title: "Three-Digit Squares",
          subtitle: "Split the number into two blocks and work from right to left.",
          content: "Split a three-digit number as A | B, where A is the first digit and B is the last two digits. Calculate A² | 2AB | B², then normalize the blocks from right to left, carrying when necessary.",
        },
        {
          id: "squares-ending-in-0",
          title: "Squares Ending in 0",
          subtitle: "Remove the zero, square the remaining number, then add two zeros.",
          content: "A number ending in 0 is 10 times another number. Squaring it gives 100 times the square of that number. For example, 70² becomes 7² × 100 = 4900.",
        },
        {
          id: "squares-ending-in-5",
          title: "Squares Ending in 5",
          subtitle: "Multiply the number before 5 by the next number, then append 25.",
          content: "For a number ending in 5, take the digits before the 5 and multiply that number by the next integer. Append 25 to the result. For example, 35² → 3 × 4 = 12 → 1225.",
        },
      ],
    },

    // --------------------------------------------------
    // Cubes
    // --------------------------------------------------
    {
      id: "cubes",
      title: "Cubes",
      shortcuts: [
        {
          id: "cubes-starting-with-1",
          title: "Cubes Starting with 1",
          subtitle: "Use the binomial pattern for numbers from 11 to 19.",
          content: "For (10 + n)³, calculate the four parts 1 | 3n | 3n² | n³, then normalize from right to left. For example, 12³ → 1 | 6 | 12 | 8 → 1728.",
        },
        {
          id: "cubes-ending-in-1",
          title: "Cubes Ending in 1",
          subtitle: "Work backwards through the powers of the leading digit.",
          content: "For (10a + 1)³, calculate a³ | 3a² | 3a | 1, then normalize from right to left. For example, 21³ → 8 | 12 | 6 | 1 → 9261.",
        },
        {
          id: "cubes-repeated-digits",
          title: "Cubes of Repeated Digits",
          subtitle: "Use the 1331 pattern for numbers such as 11, 22 and 33.",
          content: "A repeated two-digit number is 11 × a. Cubing gives 1331 × a³. For example, 22³ = 1331 × 8 = 10648.",
        },
        {
          id: "two-digit-cubes",
          title: "Two-Digit Cubes",
          subtitle: "Break the cube into four place-value blocks.",
          content: "For (10a + b)³, calculate a³ | 3a²b | 3ab² | b³. Normalize the blocks from right to left, carrying whenever necessary. For example, 23³ → 8 | 36 | 54 | 27 → 12167.",
        },
      ],
    },

    // --------------------------------------------------
    // Square Roots
    // --------------------------------------------------
    {
      id: "square-roots",
      title: "Square Roots",
      shortcuts: [
        {
          id: "recognize-perfect-squares",
          title: "Recognize Perfect Squares",
          subtitle: "Build a mental list of common squares.",
          content: "Knowing common perfect squares makes square roots much faster. For example, if you know that 12² = 144, then √144 = 12 immediately.",
        },
        {
          id: "find-the-range",
          title: "Find the Range",
          subtitle: "Bracket the number between two consecutive perfect squares.",
          content: "Find the two nearby perfect squares surrounding the number. For example, 49 < 50 < 64, so √50 lies between 7 and 8.",
        },
        {
          id: "estimate-square-root",
          title: "Estimate a Square Root",
          subtitle: "Use nearby squares to estimate a decimal root.",
          content: "Start with the two surrounding perfect squares, then test a decimal value. For example, √80 is between 8 and 9, and 8.9² = 79.21, so √80 is approximately 8.9.",
        },
        {
          id: "square-root-last-digit",
          title: "Last-Digit Clues",
          subtitle: "Use the final digit to narrow down possible roots.",
          content: "For a perfect square, the final digit can eliminate many possible roots. For example, √576 is between 20 and 30, and because the square ends in 6, the root must end in 4 or 6. Since 24² = 576, the answer is 24.",
        },
      ],
    },

    // --------------------------------------------------
    // Cube Roots
    // --------------------------------------------------
    {
      id: "cube-roots",
      title: "Cube Roots",
      shortcuts: [
        {
          id: "recognize-perfect-cubes",
          title: "Recognize Perfect Cubes",
          subtitle: "Build a mental list of common cubes.",
          content: "Knowing common perfect cubes makes cube roots much faster. For example, if you know that 12³ = 1728, then ∛1728 = 12 immediately.",
        },
        {
          id: "cube-root-last-digit",
          title: "Last-Digit Clues",
          subtitle: "The last digit of a cube determines the last digit of its root.",
          content: "For integer cubes, the final digit uniquely identifies the final digit of the cube root. For example, a cube ending in 8 must have a cube root ending in 2, because 2³ = 8.",
        },
      ],
    },
  ],
};

export default powerRootsShortcuts;
