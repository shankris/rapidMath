import { splitIntoPlaceValues } from "./utils";

export function getSubHints(question) {
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
