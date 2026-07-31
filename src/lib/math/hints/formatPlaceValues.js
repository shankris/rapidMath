export function formatPlaceValues(numbers) {
  const maxDigits = Math.max(...numbers.map((n) => n.toString().length));

  const placeNames = ["ones", "tens", "hundreds", "thousands", "tenThousands", "hundredThousands", "millions"];

  return numbers.map((number) => {
    const digits = number.toString().padStart(maxDigits, "0").split("");

    const parts = digits.map((digit, index) => {
      const power = maxDigits - index - 1;

      const value = Number(digit) * Math.pow(10, power);

      return {
        place: placeNames[power],
        digit: Number(digit),
        value,
        display: value === 0 && power > 0 ? "" : value.toLocaleString(),
      };
    });

    return {
      number,
      parts,
    };
  });
}
