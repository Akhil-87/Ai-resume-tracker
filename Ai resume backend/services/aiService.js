

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

function buildPrompt(resumeText, jobDescription) {
  return `You are an ATS (Applicant Tracking System) and career coach hybrid.

Given the RESUME and JOB DESCRIPTION below, evaluate the match.

Respond with ONLY valid JSON (no markdown fences, no preamble) matching this exact shape:
{
  "matchScore": <integer 0-100>,
  "jobTitle": "<short inferred job title from the JD>",
  "matchedKeywords": ["...", "..."],
  "missingKeywords": ["...", "..."],
  "suggestions": ["...", "...", "..."]
}

RESUME:
"""
${resumeText.slice(0, 12000)}
"""

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 6000)}
"""`;
}

export async function scoreResumeAgainstJob(resumeText, jobDescription) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set on the server. Add it to backend/.env");
  }

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(resumeText, jobDescription) }] }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No text response from Gemini");

  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Failed to parse AI response as JSON: " + cleaned.slice(0, 300));
  }
}