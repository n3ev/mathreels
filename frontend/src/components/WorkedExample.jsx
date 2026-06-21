// A quick "watch me solve a similar one" panel shown inside the concept phase.
// Steps reveal one tap at a time so the student follows the reasoning, not just
// the answer. Used for concepts where seeing it applied beats raw intuition
// (e.g. the product rule).
import { useState } from "react";
import MathText from "./MathText.jsx";

export default function WorkedExample({ worked }) {
  const [shown, setShown] = useState(1); // how many steps are revealed
  if (!worked) return null;

  const steps = worked.steps || [];
  const allOut = shown >= steps.length;

  return (
    <div className="worked">
      <div className="worked-tag">{worked.title || "Worked example"}</div>
      {worked.problem && (
        <p className="worked-problem"><MathText>{worked.problem}</MathText></p>
      )}
      <ol className="worked-steps">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className="worked-step">
            <span className="worked-num">{i + 1}</span>
            <MathText>{s}</MathText>
          </li>
        ))}
      </ol>
      {!allOut && (
        <button className="btn ghost-btn" onClick={() => setShown((n) => n + 1)}>
          Show next line ↓
        </button>
      )}
    </div>
  );
}
