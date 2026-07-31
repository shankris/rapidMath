import { splitIntoPlaceValues } from "./utils";

export function getAddHints(question) {
  return [
    {
      id: "place-values",
      title: "Place Values",

      lines: question.numbers.map((number) => `${number.toLocaleString()} = ${splitIntoPlaceValues(number)}`),
    },
  ];
}
