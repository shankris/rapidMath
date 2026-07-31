import { splitIntoPlaceValues } from "./utils";

export function getAddHints(question) {
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
