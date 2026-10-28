const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NewsCraft AI Gemini backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connection successful!",
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { topic, audience, tone, length } = req.body || {};

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        error: "Please enter a newsletter topic.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing from backend/.env",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are NewsCraft AI, a professional newsletter writer.

Create a complete newsletter with:
- An attractive title
- An introduction
- Informative sections
- A conclusion
- A call to action

Topic: ${topic.trim()}
Target audience: ${audience || "General Readers"}
Writing tone: ${tone || "Professional"}
Newsletter length: ${length || "Medium"}

Make the newsletter engaging, original, and easy to read.
`;

    console.log("Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const newsletter = response.text;

    if (!newsletter || !newsletter.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("Newsletter generated successfully.");

    return res.json({
      success: true,
      newsletter: newsletter,
    });
  } catch (error) {
    console.error("Gemini error:", error.message);

    if (error.status === 400 || error.status === 401 || error.status === 403) {
      return res.status(error.status).json({
        error: "Gemini rejected the request. Check your API key, API access, and model availability.",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Gemini usage limit reached. Check your available quota in Google AI Studio.",
      });
    }

    return res.status(500).json({
      error: "Newsletter generation failed. Check the backend terminal for details.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`NewsCraft AI Gemini backend running at http://localhost:${PORT}`);

  if (!process.env.GEMINI_API_KEY) {
    console.log("WARNING: GEMINI_API_KEY is missing from backend/.env");
  }
});