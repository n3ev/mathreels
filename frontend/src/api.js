// Thin wrapper around the MathReels backend.
const json = (r) => {
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
};

export const api = {
  getCourses: () => fetch("/api/courses").then(json),

  getQuestions: ({ course, year } = {}) => {
    const p = new URLSearchParams();
    if (course && course !== "All") p.set("course", course);
    if (year && year !== "All") p.set("year", year);
    const qs = p.toString();
    return fetch(`/api/questions${qs ? `?${qs}` : ""}`).then(json);
  },

  check: (payload) =>
    fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(json),

  getStats: (student = "demo") =>
    fetch(`/api/stats?student=${encodeURIComponent(student)}`).then(json)
};
