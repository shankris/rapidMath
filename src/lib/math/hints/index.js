import { getAddHints } from "./add";
import { getSubHints } from "./sub";
import { getMulHints } from "./mul";
import { getDivHints } from "./div";

export function getHints(question) {
  switch (question.operation) {
    case "add":
      return getAddHints(question);

    case "sub":
      return getSubHints(question);

    case "mul":
      return getMulHints(question);

    case "div":
      return getDivHints(question);

    default:
      return [];
  }
}
