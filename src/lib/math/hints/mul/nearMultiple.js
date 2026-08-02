export function getNearMultipleHint(question) {
  if (question.level < 4) {
    return null;
  }

  const [left, right] = question.numbers;

  const candidates = [50, 100];

  for (const target of candidates) {
    const leftDifference = Math.abs(left - target);

    if (leftDifference > 0 && leftDifference <= 2) {
      const diff = target - left;

      return {
        id: "near-multiple",
        title: "Near Multiple",
        strategy: "near-multiple",
        steps: [
          {
            type: "equation",
            lhs: `${target} × ${right}`,
            rhs: `${target * right}`,
          },
          {
            type: "equation",
            lhs: `${Math.abs(diff)} × ${right}`,
            rhs: `${Math.abs(diff * right)}`,
          },
        ],
      };
    }

    const rightDifference = Math.abs(right - target);

    if (rightDifference > 0 && rightDifference <= 2) {
      const diff = target - right;

      return {
        id: "near-multiple",
        title: "Near Multiple",
        strategy: "near-multiple",
        steps: [
          {
            type: "equation",
            lhs: `${left} × ${target}`,
            rhs: `${left * target}`,
          },
          {
            type: "equation",
            lhs: `${left} × ${Math.abs(diff)}`,
            rhs: `${left * Math.abs(diff)}`,
          },
        ],
      };
    }
  }

  return null;
}
