export function getTimes10Hint(question) {
  const [left, right] = question.numbers;

  let base = null;
  let other = null;

  if (right >= 10 && right % 10 === 0) {
    base = right / 10;
    other = left;
  } else if (left >= 10 && left % 10 === 0) {
    base = left / 10;
    other = right;
  } else {
    return null;
  }

  return {
    id: "times-10",
    title: "×10 Shortcut",
    priority: 100,
    steps: [
      {
        type: "equation",
        lhs: `${other} × ${base * 10}`,
        rhs: `${other} × ${base} × 10`,
      },
      {
        type: "equation",
        lhs: `${other} × ${base}`,
        rhs: "",
      },
    ],
  };
}
