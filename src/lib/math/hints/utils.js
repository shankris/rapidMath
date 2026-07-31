const PLACE_NAMES = ["ones", "tens", "hundreds", "thousands", "tenThousands", "hundredThousands", "millions"];

export function splitIntoPlaceValues(number, totalPlaces = null) {
  const digits = number.toString();

  // If no width is supplied, behave exactly as before
  const width = totalPlaces ?? digits.length;

  const paddedDigits = digits.padStart(width, "0").split("");

  return paddedDigits.map((digit, index) => {
    const placeIndex = width - index - 1;

    return {
      place: PLACE_NAMES[placeIndex],
      value: digit === "0" ? "" : Number(digit) * Math.pow(10, placeIndex),
    };
  });
}
