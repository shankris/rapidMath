import { splitIntoPlaceValues } from "./utils";

export function getSubHints(question) {
  const [left, right] = question.numbers;

  // No hints for single digit subtraction
  if (left < 10 && right < 10) {
    return [];
  }

  return [
    {
      id: "place-values",
      title: "Place Values",

      lines: question.numbers.map((number) => ({
        number,
        values: splitIntoPlaceValues(number),
      })),
    },
  ];
}
