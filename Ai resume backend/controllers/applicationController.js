import Application from "../models/Application.js";

function sendError(res, err) {
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid application id" });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Unable to process the application" });
}

export async function createApplication(req, res) {
  try {
    const { company, role, jobDescription, notes } = req.body;
    const app = await Application.create({ company, role, jobDescription, notes });
    return res.status(201).json(app);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function listApplications(req, res) {
  try {
    const apps = await Application.find().populate("resume", "fileName").sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function updateApplication(req, res) {
  try {
    const allowedFields = ["company", "role", "jobDescription", "notes", "resume", "matchScore"];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]])
    );
    const app = await Application.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json(app);
  } catch (err) {
    return sendError(res, err);
  }
}

// Dedicated endpoint for drag-and-drop status changes on the board
export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const valid = ["Saved", "Applied", "Interview", "Offer", "Rejected"];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "Applied" ? { appliedDate: new Date() } : {})
      },
      { new: true }
    );
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json(app);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function deleteApplication(req, res) {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ error: "Application not found" });
    return res.json({ success: true });
  } catch (err) {
    return sendError(res, err);
  }
}
