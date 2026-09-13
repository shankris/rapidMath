// src/app/practice/[operation]/[level]/targeted/page.js

import PracticeSession from "@/components/Practice/PracticeSession";

export default async function TargetedPracticePage({ params }) {
  const { operation, level } = await params;

  return (
    <PracticeSession
      operation={operation}
      level={Number(level)}
      targeted
    />
  );
}
