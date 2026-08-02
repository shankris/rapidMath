export default function SplitNumberHint({ hint }) {
  return (
    <div>
      {hint.steps.map((step, index) => (
        <div key={index}>
          {step.type === "text" && <p>{step.text}</p>}

          {step.type === "equation" && (
            <p>
              {step.lhs} = {step.rhs}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
