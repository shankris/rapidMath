export default function NearMultipleHint({ hint }) {
  return (
    <div>
      {hint.steps.map((step, index) => (
        <div key={index}>
          {step.type === "equation" ? (
            <>
              {step.lhs}
              {step.rhs && ` = ${step.rhs}`}
            </>
          ) : (
            step.text
          )}
        </div>
      ))}
    </div>
  );
}
