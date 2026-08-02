import { splitIntoPlaceValues } from "./utils";

export function getAddHints(question) {
  const [left, right] = question.numbers;

  // No hints for single digit addition
  if (left < 10 && right < 10) {
    return [];
  }

  const shouldShow = question.numbers.some((n) => n >= 10);

  if (!shouldShow) {
    return [];
  }

  const totalPlaces = Math.max(...question.numbers.map((n) => n.toString().length));

  return [
    {
      id: "place-values",
      title: "Place Values",

      lines: question.numbers.map((number) => ({
        number,
        values: splitIntoPlaceValues(number, totalPlaces),
      })),
    },
  ];
}
