export function splitIntoPlaceValues(number) {
  return number
    .toString()
    .split("")
    .map((digit, index, arr) => {
      const place = arr.length - index - 1;
      const value = Number(digit) * Math.pow(10, place);

      return value > 0 ? value : null;
    })
    .filter(Boolean)
    .join(" + ");
}
