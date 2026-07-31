export function formatPlaceValues(numbers) {
  // Find the largest number of digits
  const maxDigits = Math.max(...numbers.map((n) => n.toString().length));

  return numbers.map((number) => {
    const digits = number.toString().padStart(maxDigits, "0").split("");

    const parts = digits.map((digit, index) => {
      const power = maxDigits - index - 1;

      return Number(digit) * Math.pow(10, power);
    });

    return {
      number,
      parts,
    };
  });
}
