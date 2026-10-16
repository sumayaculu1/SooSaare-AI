require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// HELPER
// ======================================================

function getPrompt({ mode, topic, platform, language }) {
  // ----------------------------------------------------
  // IDEAS
  // ----------------------------------------------------

  if (mode === "ideas") {
    return `
You are SooSaare AI, a professional content strategist
for Somali creators and businesses.

The user wants CONTENT IDEAS.

Topic:
${topic}

Target platform:
${platform}

Language:
${language}

Generate exactly 10 strong content ideas.

Each idea must:
- Be specific
- Be interesting
- Have a strong potential hook
- Be suitable for ${platform}
- Be useful for creators, students, businesses, or audiences
- Avoid generic ideas
- Feel human and practical

Return ONLY valid JSON using this structure:

{
  "ideas": [
    {
      "title": "Content idea title",
      "angle": "Short explanation of the content angle",
      "hook": "A strong opening hook"
    }
  ]
}
`;
  }

  // ----------------------------------------------------
  // CREATE
  // ----------------------------------------------------

  if (mode === "idea") {
    return `
You are SooSaare AI, a professional content creator
and content strategist.

The user has an idea and wants you to turn it into
ready-to-publish content.

User idea:
${topic}

Platform:
${platform}

Language:
${language}

Create professional, natural, engaging content.

The content should NOT sound robotic or obviously AI-generated.

Return ONLY valid JSON using this structure:

{
  "hook": "Strong attention-grabbing opening",
  "script": "Complete video script",
  "visuals": [
    "Visual direction 1",
    "Visual direction 2",
    "Visual direction 3",
    "Visual direction 4"
  ],
  "caption": "Platform-ready caption",
  "cta": "Strong call to action",
  "hashtags": [
    "#hashtag1",
    "#hashtag2",
    "#hashtag3",
    "#hashtag4",
    "#hashtag5"
  ]
}

Rules:
- Make the hook strong within the first 3 seconds.
- Script should be natural and easy to speak.
- Visual directions should be practical.
- Caption should fit ${platform}.
- CTA should encourage engagement.
- Hashtags must be relevant.
- Write everything in ${language}.
`;
  }

  // ----------------------------------------------------
  // REPURPOSE
  // ----------------------------------------------------

  if (mode === "repurpose") {
    return `
You are SooSaare AI, a professional content repurposing
strategist.

The user has existing content and wants to transform it
into a new piece of content.

Existing content:
${topic}

Target platform:
${platform}

Language:
${language}

Transform the content while preserving its main message.

Do NOT simply copy the original text.

Adapt:
- Hook
- Structure
- Tone
- Length
- Platform style
- Call to action

Make it feel native to ${platform}.

Return ONLY valid JSON using this structure:

{
  "hook": "New platform-specific hook",
  "script": "Repurposed complete script",
  "visuals": [
    "Visual direction 1",
    "Visual direction 2",
    "Visual direction 3",
    "Visual direction 4"
  ],
  "caption": "New platform-specific caption",
  "cta": "New call to action",
  "hashtags": [
    "#hashtag1",
    "#hashtag2",
    "#hashtag3",
    "#hashtag4",
    "#hashtag5"
  ]
}

Write everything in ${language}.
`;
  }

  return null;
}

// ======================================================
// GENERATE CONTENT
// ======================================================

app.post("/api/generate", async (req, res) => {
  try {
    const {
      topic,
      platform = "TikTok",
      language = "Somali",
      mode = "idea",
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        error: "Topic or content is required.",
      });
    }

    if (!["ideas", "idea", "repurpose"].includes(mode)) {
      return res.status(400).json({
        error: "Invalid content mode.",
      });
    }

    const prompt = getPrompt({
      mode,
      topic,
      platform,
      language,
    });

    if (!prompt) {
      return res.status(400).json({
        error: "Could not create AI prompt.",
      });
    }

    console.log("\n==============================");
    console.log("SOOSAARE AI REQUEST");
    console.log("==============================");
    console.log("Mode:", mode);
    console.log("Platform:", platform);
    console.log("Language:", language);
    console.log("Topic:", topic);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        temperature: 0.8,
      },
    });

    const rawText = response.text;

    console.log("\nAI RESPONSE:");
    console.log(rawText);

    let content;

    try {
      content = JSON.parse(rawText);
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);

      return res.status(500).json({
        error: "AI returned an invalid response.",
        raw: rawText,
      });
    }

    return res.json({
      success: true,
      mode,
      platform,
      language,
      content,
    });
  } catch (error) {
    console.error("\nGEMINI ERROR:");
    console.error(error);

    return res.status(500).json({
      error:
        error.message ||
        "Something went wrong while generating content.",
    });
  }
});

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.send("SooSaare AI Agent Backend is running 🚀");
});

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
  console.log(`
========================================
       SOOSAARE AI BACKEND
========================================

Server: http://localhost:${PORT}

Available:
POST /api/generate

Modes:
✦ ideas
↗ idea
◈ repurpose

========================================
`);
});