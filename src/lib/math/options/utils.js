// src/lib/math/options/utils.js

export function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getParity(number) {
  return number % 2 === 0 ? "even" : "odd";
}

export function matchParity(answer, value) {
  return getParity(answer) === getParity(value) ? value : value + 1;
}
