export function getTimes25Hint(question) {
  const [left, right] = question.numbers;

  let value = null;

  if (left === 25) {
    value = right;
  } else if (right === 25) {
    value = left;
  } else {
    return null;
  }

  // Levels 5-6:
  // Only show when divisible by 4.
  if (question.level <= 6 && value % 4 !== 0) {
    return null;
  }

  const divided = value / 4;

  return {
    id: "times-25",
    title: "×25 Trick",

    steps: [
      {
        type: "equation",
        lhs: `${value} ÷ 4`,
        rhs: `${divided}`,
      },
      {
        type: "equation",
        lhs: `${divided} × 100`,
        rhs: "",
      },
    ],
  };
}
