import { generateTest } from "@/lib/math/generateTest";

export default function TestPage() {
  const test = generateTest({
    operation: "add",
    level: 3,
    count: 5,
  });

  return <pre>{JSON.stringify(test, null, 2)}</pre>;
}
