export default function ApplicationCard({ app, onDragStart, onDelete }) {
  return (
    <div
      className="app-card"
      draggable
      onDragStart={(e) => onDragStart(e, app._id)}
    >
      <div className="app-card-top">
        <strong>{app.role}</strong>
        {typeof app.matchScore === "number" && (
          <span className="score-badge">{app.matchScore}%</span>
        )}
      </div>
      <p className="muted">{app.company}</p>
      {app.notes && <p className="app-notes">{app.notes}</p>}
      <div className="app-card-footer">
        <span className="muted small">
          {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : "—"}
        </span>
        <button className="link-btn" onClick={() => onDelete(app._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}