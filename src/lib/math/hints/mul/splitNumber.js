export function getSplitNumberHint(question) {
  const [left, right] = question.numbers;
  let split = null;
  let other = null;

  if (left >= 10) {
    split = left;
    other = right;
  } else if (right >= 10) {
    split = right;
    other = left;
  } else {
    return null;
  }

  const tens = Math.floor(split / 10) * 10;
  const ones = split % 10;

  return {
    id: "split-number",
    title: "Split Number",
    strategy: "split-number",
    steps: [
      {
        type: "equation",
        lhs: `${tens} × ${other}`,
        rhs: `${tens * other}`,
      },
      {
        type: "equation",
        lhs: `${ones} × ${other}`,
        rhs: `${ones * other}`,
      },
    ],
  };
}
