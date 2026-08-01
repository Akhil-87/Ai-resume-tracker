import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jobDescription: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Saved", "Applied", "Interview", "Offer", "Rejected"],
      default: "Saved"
    },
    matchScore: { type: Number, default: null },
    notes: { type: String, default: "" },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", default: null },
    appliedDate: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
