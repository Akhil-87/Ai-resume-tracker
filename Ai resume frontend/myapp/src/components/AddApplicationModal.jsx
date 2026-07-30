import { useState } from "react";

export default function AddApplicationModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    company: "",
    role: "",
    jobDescription: "",
    notes: ""
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.company || !form.role) return;
    onCreate(form);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add Application</h3>
        <form onSubmit={submit}>
          <label>
            Company
            <input
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              required
            />
          </label>
          <label>
            Role
            <input
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              required
            />
          </label>
          <label>
            Job Description (optional)
            <textarea
              rows={4}
              value={form.jobDescription}
              onChange={(e) => update("jobDescription", e.target.value)}
            />
          </label>
          <label>
            Notes
            <input value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}