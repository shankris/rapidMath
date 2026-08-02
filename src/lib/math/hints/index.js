import { getAddHints } from "./add";
import { getSubHints } from "./sub";
// import { getMulHints } from "./mul";
import { getMulHints } from "./mul/index";

export function getHints(question) {
  console.log("HINT INDEX LOADED");
  switch (question.operation) {
    case "add":
      return getAddHints(question);

    case "sub":
      return getSubHints(question);

    case "mul":
      return getMulHints(question);

    default:
      return [];
  }
}
