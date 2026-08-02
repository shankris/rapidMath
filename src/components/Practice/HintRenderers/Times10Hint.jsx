export default function Times10Hint({ hint }) {
  return (
    <div>
      {hint.steps.map((step, index) => (
        <div
          key={index}
          className='hintStep'
        >
          {step.lhs}
          {step.rhs && ` = ${step.rhs}`}
        </div>
      ))}
    </div>
  );
}
