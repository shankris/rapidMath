/* src/app/[locale]/practice/review/page.js */

import ReviewQuiz from "@/components/ReviewQuiz/ReviewQuiz";

/* --------------------------------------------------
   Review Quiz Page
-------------------------------------------------- */

export default async function ReviewPage({ searchParams }) {
  const params = await searchParams;

  const date = params.date ?? "";
  const operation = params.opp ?? "";
  const level = params.level ?? "";

  return (
    <ReviewQuiz
      date={date}
      operation={operation}
      level={level}
    />
  );
}
