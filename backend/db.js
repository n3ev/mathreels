// SQLite connection + schema for MathReels.
// Uses better-sqlite3 (synchronous, zero-config, file-based DB).
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "mathreels.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// --- Schema ---------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    course       TEXT    NOT NULL,   -- Standard | Advanced | Extension 1 | Extension 2
    year         INTEGER NOT NULL,   -- 11 | 12
    topic        TEXT    NOT NULL,
    difficulty   INTEGER NOT NULL,   -- 1..5
    title        TEXT    NOT NULL,
    prompt       TEXT    NOT NULL,   -- supports inline LaTeX via $...$
    scratchpad   INTEGER NOT NULL DEFAULT 0,  -- show rough-work canvas?
    final_answer TEXT,
    explanation  TEXT,
    key_concept  TEXT,               -- the one named idea this question drills (e.g. "The power rule")
    concept      TEXT,               -- JSON: the "idea" phase shown before the question
    steps        TEXT    NOT NULL    -- JSON array of step objects
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    student     TEXT    NOT NULL DEFAULT 'demo',
    question_id INTEGER NOT NULL,
    step_index  INTEGER NOT NULL,
    response    TEXT,
    correct     INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (question_id) REFERENCES questions(id)
  );
`);

// --- Lightweight migration ------------------------------------------------
// Add the `concept` column to any DB created before this feature existed.
const cols = db.prepare("PRAGMA table_info(questions)").all().map((c) => c.name);
if (!cols.includes("concept")) {
  db.exec("ALTER TABLE questions ADD COLUMN concept TEXT");
}
if (!cols.includes("key_concept")) {
  db.exec("ALTER TABLE questions ADD COLUMN key_concept TEXT");
}

export default db;
export { DB_PATH };
