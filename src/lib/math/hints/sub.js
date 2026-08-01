import { splitIntoPlaceValues } from "./utils";

export function getSubHints(question) {
  const shouldShow = question.numbers.some((n) => n.toString().length > 1);

  if (!shouldShow) {
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
