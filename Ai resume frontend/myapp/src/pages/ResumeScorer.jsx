import { useEffect, useState } from "react";
import { api } from "../api";
import ResumeUpload from "../components/ResumeUpload";
import ScoreResult from "../components/ScoreResult";

export default function ResumeScorer() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      const data = await api.listResumes();
      setResumes(data);
      if (data.length && !selectedId) setSelectedId(data[0]._id);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleUploaded(resume) {
    setResumes((prev) => [resume, ...prev]);
    setSelectedId(resume._id);
    setResult(null);
  }

  async function handleScore() {
    if (!selectedId || !jobDescription.trim()) return;
    setScoring(true);
    setError("");
    setResult(null);
    try {
      const resume = await api.scoreResume(selectedId, jobDescription);
      setResult(resume.lastScore);
    } catch (err) {
      setError(err.message);
    } finally {
      setScoring(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Resume Scorer</h2>
      </div>

      <div className="scorer-grid">
        <div className="panel">
          <h4>1. Upload a resume</h4>
          <ResumeUpload onUploaded={handleUploaded} />

          <h4 style={{ marginTop: "1.5rem" }}>2. Pick a resume</h4>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">-- select --</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.fileName}
              </option>
            ))}
          </select>

          <h4 style={{ marginTop: "1.5rem" }}>3. Paste job description</h4>
          <textarea
            rows={8}
            placeholder="Paste the job description here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            className="btn-primary"
            style={{ marginTop: "1rem" }}
            disabled={!selectedId || !jobDescription.trim() || scoring}
            onClick={handleScore}
          >
            {scoring ? "Scoring…" : "Score Resume"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>

        <div className="panel">
          <h4>Result</h4>
          {!result && !scoring && <p className="muted">Score a resume to see results here.</p>}
          {scoring && <p className="muted">Analyzing with AI…</p>}
          <ScoreResult score={result} />
        </div>
      </div>
    </div>
  );
}