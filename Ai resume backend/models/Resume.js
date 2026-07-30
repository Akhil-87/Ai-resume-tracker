import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
    lastScore: {
      matchScore: Number,
      matchedKeywords: [String],
      missingKeywords: [String],
      suggestions: [String],
      jobTitle: String,
      scoredAt: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);