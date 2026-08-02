export function getDoubleHalfHint(question) {
  const [left, right] = question.numbers;

  // One number must be even
  if (right % 2 === 0) {
    return {
      id: "double-half",
      title: "Double & Half",
      priority: 90,
      steps: [
        {
          type: "equation",
          lhs: `${left} × ${right}`,
          rhs: `${left * 2} × ${right / 2}`,
        },
      ],
    };
  }

  if (left % 2 === 0) {
    return {
      id: "double-half",
      title: "Double & Half",
      priority: 90,
      steps: [
        {
          type: "equation",
          lhs: `${left} × ${right}`,
          rhs: `${left / 2} × ${right * 2}`,
        },
      ],
    };
  }

  return null;
}
