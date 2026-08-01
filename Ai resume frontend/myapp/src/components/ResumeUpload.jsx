import { useRef, useState } from "react";
import { api } from "../Api";

export default function ResumeUpload({ onUploaded }) {
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const resume = await api.uploadResume(file);
      onUploaded(resume);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      inputRef.current.value = "";
    }
  }

  return (
    <div className="upload-box">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFile}
        disabled={loading}
      />
      {loading && <p className="muted">Uploading &amp; parsing…</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
