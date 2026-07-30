import { useEffect, useState } from "react";
import { api } from "../api";
import ApplicationCard from "../components/ApplicationCard";
import AddApplicationModal from "../components/AddApplicationModal";

const COLUMNS = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export default function Dashboard() {
  const [apps, setApps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await api.listApplications();
      setApps(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate(form) {
    try {
      const created = await api.createApplication(form);
      setApps((prev) => [created, ...prev]);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setApps((prev) => prev.filter((a) => a._id !== id));
    try {
      await api.deleteApplication(id);
    } catch (err) {
      setError(err.message);
      load();
    }
  }

  function onDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
  }

  async function onDrop(e, status) {
    const id = e.dataTransfer.getData("text/plain");
    setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    try {
      await api.updateStatus(id, status);
    } catch (err) {
      setError(err.message);
      load();
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Application Board</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Application
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="board">
        {COLUMNS.map((col) => (
          <div
            key={col}
            className="board-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col)}
          >
            <h3>
              {col} <span className="muted">({apps.filter((a) => a.status === col).length})</span>
            </h3>
            <div className="board-column-body">
  {apps.filter((a) => a.status === col).length === 0 && (
    <p className="board-empty">No entries in {col.toLowerCase()} yet</p>
  )}
  {apps
    .filter((a) => a.status === col)
    .map((app) => (
      <ApplicationCard
        key={app._id}
        app={app}
        onDragStart={onDragStart}
        onDelete={handleDelete}
      />
    ))}
</div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddApplicationModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}