export default function ScoreResult({ score }) {
  if (!score) return null;
  const { matchScore, jobTitle, matchedKeywords, missingKeywords, suggestions } = score;

  const color = matchScore >= 75 ? "#16a34a" : matchScore >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="score-result">
      <div className="score-header">
        <div className="score-circle" style={{ borderColor: color, color }}>
          {matchScore}
        </div>
        <div>
          <h3>Match Score{jobTitle ? ` — ${jobTitle}` : ""}</h3>
          <p className="muted">Out of 100</p>
        </div>
      </div>

      <div className="keyword-columns">
        <div>
          <h4>✅ Matched Keywords</h4>
          <div className="chip-list">
            {matchedKeywords?.length ? (
              matchedKeywords.map((k) => (
                <span className="chip chip-good" key={k}>
                  {k}
                </span>
              ))
            ) : (
              <p className="muted">None found</p>
            )}
          </div>
        </div>
        <div>
          <h4>⚠️ Missing Keywords</h4>
          <div className="chip-list">
            {missingKeywords?.length ? (
              missingKeywords.map((k) => (
                <span className="chip chip-bad" key={k}>
                  {k}
                </span>
              ))
            ) : (
              <p className="muted">None — great coverage!</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4>💡 Suggestions</h4>
        <ul>
          {suggestions?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}