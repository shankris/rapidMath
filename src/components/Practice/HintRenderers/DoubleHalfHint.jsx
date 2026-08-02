export default function DoubleHalfHint({ hint }) {
  return (
    <div>
      {hint.steps.map((step, index) => (
        <p key={index}>
          {step.lhs} = {step.rhs}
        </p>
      ))}
    </div>
  );
}
