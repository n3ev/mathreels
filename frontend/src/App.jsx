import { useEffect, useState, useCallback } from "react";
import Reel from "./components/Reel.jsx";
import { api } from "./api.js";

const COURSES = ["All", "Standard", "Advanced", "Extension 1", "Extension 2"];
const YEARS = ["All", "11", "12"];

export default function App() {
  const [course, setCourse] = useState("All");
  const [year, setYear] = useState("All");
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ correct: 0, attempts: 0, questionsAttemptedCorrectly: 0 });
  const [error, setError] = useState(null);

  const loadStats = useCallback(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    api
      .getQuestions({ course, year })
      .then((qs) => setQuestions(qs))
      .catch(() => setError("Could not reach the backend. Is it running on :4000?"));
    loadStats();
  }, [course, year, loadStats]);

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="logo">∑</span>
          <div>
            <div className="brand-name">MathReels</div>
            <div className="brand-sub">by Mathologists · NSW ATAR</div>
          </div>
        </div>
        <div className="stat-pills">
          <span className="stat-pill">{stats.questionsAttemptedCorrectly} solved</span>
          <span className="stat-pill">
            {stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0}% acc
          </span>
        </div>
      </div>

      <div className="filters">
        <div className="filter-row">
          {COURSES.map((c) => (
            <button
              key={c}
              className={"pill" + (course === c ? " active" : "")}
              onClick={() => setCourse(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="filter-row">
          {YEARS.map((y) => (
            <button
              key={y}
              className={"pill small" + (year === y ? " active" : "")}
              onClick={() => setYear(y)}
            >
              {y === "All" ? "All years" : `Year ${y}`}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <main className="feed">
        {questions.length === 0 && !error && (
          <div className="empty">No reels for this filter yet.</div>
        )}
        {questions.map((q, i) => (
          <Reel key={q.id} question={q} index={i + 1} onSolved={loadStats} />
        ))}
      </main>
    </div>
  );
}
