// MathReels API - Express + SQLite.
// Answer keys live ONLY on the server; the client never receives correctIndex /
// accepted answers. Checking + attempt logging happens via POST /api/check.
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In production we build the React app to frontend/dist and serve it from here,
// so the whole thing runs as a single web service on one URL.
const distDir = path.resolve(__dirname, "../frontend/dist");

app.use(cors());
app.use(express.json());

// Normalise free-text answers for forgiving comparison.
function normalise(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[{}]/g, "")
    .replace(/\\/g, "")
    .replace(/√/g, "sqrt")
    .replace(/×/g, "*")
    .replace(/−/g, "-"); // unicode minus → hyphen
}

// Strip answer keys before sending a question to the client.
function publicQuestion(row) {
  const steps = JSON.parse(row.steps).map((step) => ({
    kind: step.kind,
    prompt: step.prompt,
    options: step.options ?? null,
    hint: step.hint ?? null
    // correctIndex / accepted / explanation withheld until /api/check
  }));
  return {
    id: row.id,
    course: row.course,
    year: row.year,
    topic: row.topic,
    difficulty: row.difficulty,
    title: row.title,
    prompt: row.prompt,
    scratchpad: !!row.scratchpad,
    keyConcept: row.key_concept ?? null,
    concept: row.concept ? JSON.parse(row.concept) : null,
    stepCount: steps.length,
    steps
  };
}

// --- Routes ---------------------------------------------------------------
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "mathreels" }));

app.get("/api/courses", (_req, res) => {
  const rows = db.prepare("SELECT DISTINCT course FROM questions").all();
  res.json(rows.map((r) => r.course));
});

// Feed of reels. Optional filters: ?course=Advanced&year=12
app.get("/api/questions", (req, res) => {
  const { course, year } = req.query;
  let sql = "SELECT * FROM questions";
  const where = [];
  const params = {};
  if (course) { where.push("course = @course"); params.course = course; }
  if (year)   { where.push("year = @year");     params.year = Number(year); }
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY difficulty ASC, id ASC";
  const rows = db.prepare(sql).all(params);
  res.json(rows.map(publicQuestion));
});

app.get("/api/questions/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(publicQuestion(row));
});

// Check a single step's answer and log the attempt.
app.post("/api/check", (req, res) => {
  const { questionId, stepIndex, answer, student = "demo" } = req.body ?? {};
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(questionId);
  if (!row) return res.status(404).json({ error: "Question not found" });

  const steps = JSON.parse(row.steps);
  const step = steps[stepIndex];
  if (!step) return res.status(400).json({ error: "Invalid stepIndex" });

  let correct = false;
  if (step.kind === "mcq") {
    correct = Number(answer) === step.correctIndex;
  } else if (step.kind === "text") {
    const want = (step.accepted ?? []).map(normalise);
    correct = want.includes(normalise(answer));
  }

  db.prepare(
    "INSERT INTO attempts (student, question_id, step_index, response, correct) VALUES (?,?,?,?,?)"
  ).run(student, questionId, stepIndex, String(answer ?? ""), correct ? 1 : 0);

  const isLastStep = stepIndex === steps.length - 1;
  res.json({
    correct,
    explanation: step.explanation ?? null,
    correctIndex: step.kind === "mcq" ? step.correctIndex : undefined,
    finalAnswer: isLastStep && correct ? row.final_answer : undefined,
    questionExplanation: isLastStep && correct ? row.explanation : undefined,
    isLastStep
  });
});

// Simple progress stats for the demo header.
app.get("/api/stats", (req, res) => {
  const student = req.query.student || "demo";
  const totals = db
    .prepare(
      "SELECT COUNT(*) AS attempts, SUM(correct) AS correct FROM attempts WHERE student = ?"
    )
    .get(student);
  const solved = db
    .prepare(
      `SELECT COUNT(DISTINCT question_id) AS n FROM attempts
       WHERE student = ? AND correct = 1`
    )
    .get(student);
  res.json({
    attempts: totals.attempts || 0,
    correct: totals.correct || 0,
    questionsAttemptedCorrectly: solved.n || 0
  });
});

// Serve the built frontend (production). The API routes above are matched first,
// so this only handles page/asset requests. Falls back to index.html so the
// single-page app works on any path. Skipped in dev when there is no build yet.
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));
}

app.listen(PORT, () => {
  console.log(`🚀 MathReels running on http://localhost:${PORT}`);
});
