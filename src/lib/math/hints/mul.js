export function getMulHints(question) {
  const [a, b] = question.numbers;

  if (b < 10) {
    return [];
  }

  const tens = Math.floor(b / 10) * 10;
  const ones = b % 10;

  const lines = [];

  if (tens) {
    lines.push(`${a} × ${tens} = ${a * tens}`);
  }

  if (ones) {
    lines.push(`${a} × ${ones} = ${a * ones}`);
  }

  lines.push(`${a * tens} + ${a * ones} = ${a * b}`);

  return [
    {
      id: "split-number",

      title: "Split Number",

      intro: `${b} = ${tens} + ${ones}`,

      lines,
    },
  ];
}
