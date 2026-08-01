import Resume from "../models/Resume.js";
import { extractTextFromFile } from "../services/parseResume.js";
import { scoreResumeAgainstJob } from "../services/aiService.js";

function sendError(res, err) {
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid resume id" });
  }

  if (err.name === "ValidationError" || err.message === "Unsupported file type") {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Unable to process the resume" });
}

export async function uploadResume(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const rawText = await extractTextFromFile(req.file);
    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({ error: "Could not extract meaningful text from file" });
    }

    const resume = await Resume.create({
      fileName: req.file.originalname,
      rawText
    });

    res.status(201).json(resume);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function listResumes(req, res) {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 }).select("-rawText");
    res.json(resumes);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function scoreResume(req, res) {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({ error: "jobDescription is required" });
    }

    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const result = await scoreResumeAgainstJob(resume.rawText, jobDescription);

    resume.lastScore = { ...result, scoredAt: new Date() };
    await resume.save();

    res.json(resume);
  } catch (err) {
    return sendError(res, err);
  }
}

export async function deleteResume(req, res) {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    return res.json({ success: true });
  } catch (err) {
    return sendError(res, err);
  }
}
