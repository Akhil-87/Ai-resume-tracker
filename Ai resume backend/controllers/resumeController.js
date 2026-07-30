import Resume from "../models/Resume.js";
import { extractTextFromFile } from "../services/parseResume.js";
import { scoreResumeAgainstJob } from "../services/aiService.js";

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
    res.status(500).json({ error: err.message });
  }
}

export async function listResumes(req, res) {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 }).select("-rawText");
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
}

export async function deleteResume(req, res) {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}