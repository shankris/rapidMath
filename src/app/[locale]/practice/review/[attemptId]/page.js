/* src/app/[locale]/practice/review/[attemptId]/page.js */

import ReviewQuiz from "@/components/ReviewQuiz/ReviewQuiz";

export default async function ReviewPage({ params }) {
  const { attemptId } = await params;

  return <ReviewQuiz attemptId={attemptId} />;
}
