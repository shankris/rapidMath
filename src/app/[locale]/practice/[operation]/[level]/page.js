import PracticeSession from "@/components/Practice/PracticeSession";

export default async function PracticePage({ params }) {
  const { operation, level } = await params;

  return (
    <PracticeSession
      operation={operation}
      level={Number(level)}
    />
  );
}
