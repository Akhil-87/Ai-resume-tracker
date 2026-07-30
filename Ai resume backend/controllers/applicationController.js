import Application from "../models/Application.js";

export async function createApplication(req, res) {
  try {
    const app = await Application.create(req.body);
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listApplications(req, res) {
  try {
    const apps = await Application.find().populate("resume", "fileName").sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateApplication(req, res) {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
}

export async function deleteApplication(req, res) {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}