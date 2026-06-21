// One full-screen "reel" = one question the student walks through step-by-step.
import { useState } from "react";
import MathText from "./MathText.jsx";
import Scratchpad from "./Scratchpad.jsx";
import ConceptAnimation from "./ConceptAnimation.jsx";
import WorkedExample from "./WorkedExample.jsx";
import { api } from "../api.js";

// Which concept "kinds" have a hand-built canvas animation.
const ANIMATABLE = new Set(["tangent", "area"]);

// Different colours of chalk per course - like a real classroom board.
const courseColors = {
  "Standard": "#eef5f0",     // white chalk
  "Advanced": "#54e08a",     // green chalk
  "Extension 1": "#fcd34d",  // yellow chalk
  "Extension 2": "#fb7185"   // pink chalk
};

export default function Reel({ question, index, onSolved }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState(null);   // mcq choice index
  const [text, setText] = useState("");             // text input
  const [feedback, setFeedback] = useState(null);   // {correct, explanation, correctIndex,...}
  const [done, setDone] = useState(false);
  const [reveal, setReveal] = useState(null);       // {finalAnswer, questionExplanation}
  // ChessReels-style: show the animated idea first, then the question.
  const [showConcept, setShowConcept] = useState(!!question.concept);

  const step = question.steps[stepIdx];
  const accent = courseColors[question.course] || "#54e08a";
  const marks = question.difficulty; // difficulty doubles as "marks" on the exam card

  async function submit() {
    const answer = step.kind === "mcq" ? selected : text;
    if (answer === null || answer === "") return;
    const res = await api.check({
      questionId: question.id,
      stepIndex: stepIdx,
      answer
    });
    setFeedback(res);
    if (res.correct && res.isLastStep) {
      setReveal({ finalAnswer: res.finalAnswer, questionExplanation: res.questionExplanation });
      setDone(true);
      onSolved?.();
    }
  }

  function next() {
    setStepIdx((i) => i + 1);
    setSelected(null);
    setText("");
    setFeedback(null);
  }

  function retry() {
    setFeedback(null);
    setSelected(null);
    setText("");
  }

  const progress = ((stepIdx + (done ? 1 : 0)) / question.steps.length) * 100;

  return (
    <section className="reel" style={{ "--accent": accent }}>
      <div className="reel-inner">
        <header className="reel-head">
          <span className="chip" style={{ color: accent, borderColor: accent }}>{question.course}</span>
          <span className="chip ghost">Year {question.year}</span>
          <span className="chip ghost">{question.topic}</span>
        </header>

        {/* PHASE 1 - the idea (only if this reel has a concept) */}
        {showConcept && question.concept && (
          <div className="concept">
            <div className="concept-tag">★ The idea</div>
            {question.keyConcept && (
              <span className="key-concept">{question.keyConcept}</span>
            )}
            <h2 className="concept-title">{question.concept.title}</h2>
            {ANIMATABLE.has(question.concept.kind) && (
              <ConceptAnimation concept={question.concept} />
            )}
            {question.concept.takeaway && (
              <p className="concept-takeaway"><MathText>{question.concept.takeaway}</MathText></p>
            )}
            {question.concept.worked && (
              <WorkedExample worked={question.concept.worked} />
            )}
            <button className="btn primary big" onClick={() => setShowConcept(false)}>
              Got it - let me try ↓
            </button>
          </div>
        )}

        {/* PHASE 2 - the question */}
        {!showConcept && (
        <>
        <div className="progress"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>

        {/* Exam-style problem card on graph paper */}
        <div className="problem">
          <div className="problem-meta">
            <span className="qnum">Q{index}</span>
            <span className="qtitle">{question.title}</span>
            <span className="marks">({marks} {marks === 1 ? "mark" : "marks"})</span>
          </div>
          <p className="reel-prompt"><MathText>{question.prompt}</MathText></p>
          {question.keyConcept && (
            <div className="key-concept-row">
              <span className="key-concept small">{question.keyConcept}</span>
            </div>
          )}
        </div>

        {!done && (
          <div className="step">
            <p className="step-prompt">
              <span className="step-tag">
                Step {stepIdx + 1}/{question.steps.length} · {step.kind === "mcq" ? "Choose" : "Type"}
              </span>
              <MathText>{step.prompt}</MathText>
            </p>

            {step.kind === "mcq" && (
              <div className="options">
                {step.options.map((opt, i) => {
                  const isPicked = selected === i;
                  const isAnswer = feedback && feedback.correctIndex === i;
                  const isWrongPick = feedback && isPicked && !feedback.correct;
                  return (
                    <button
                      key={i}
                      disabled={!!feedback}
                      className={
                        "option" +
                        (isPicked ? " picked" : "") +
                        (isAnswer ? " correct" : "") +
                        (isWrongPick ? " wrong" : "")
                      }
                      onClick={() => setSelected(i)}
                    >
                      <span className="option-key">{String.fromCharCode(65 + i)}</span>
                      <MathText>{opt}</MathText>
                    </button>
                  );
                })}
              </div>
            )}

            {step.kind === "text" && (
              <input
                className={
                  "text-input" +
                  (feedback ? (feedback.correct ? " correct" : " wrong") : "")
                }
                placeholder="Type your answer…"
                value={text}
                disabled={feedback && feedback.correct}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !feedback && submit()}
                inputMode="text"
                autoComplete="off"
              />
            )}

            {question.scratchpad && <Scratchpad />}

            {feedback && (
              <div className={"feedback " + (feedback.correct ? "ok" : "no")}>
                <strong>{feedback.correct ? "Correct!" : "Not quite -"}</strong>
                {feedback.explanation && (
                  <p><MathText>{feedback.explanation}</MathText></p>
                )}
              </div>
            )}

            <div className="actions">
              {!feedback && (
                <button className="btn primary" onClick={submit}>Check</button>
              )}
              {feedback && !feedback.correct && (
                <button className="btn" onClick={retry}>Try again</button>
              )}
              {feedback && feedback.correct && !feedback.isLastStep && (
                <button className="btn primary" onClick={next}>Next step →</button>
              )}
              {step.hint && !feedback && (
                <details className="hint">
                  <summary>Hint</summary>
                  <MathText>{step.hint}</MathText>
                </details>
              )}
            </div>
          </div>
        )}

        {done && reveal && (
          <div className="solved">
            <div className="solved-badge">Nailed it!</div>
            {reveal.finalAnswer && (
              <p className="final"><span>Answer</span> <MathText>{reveal.finalAnswer}</MathText></p>
            )}
            {reveal.questionExplanation && (
              <p className="walkthrough"><MathText>{reveal.questionExplanation}</MathText></p>
            )}
            <p className="swipe-hint">swipe up for the next one ↑</p>
          </div>
        )}
        </>
        )}
      </div>
    </section>
  );
}
