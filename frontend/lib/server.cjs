const path = require("node:path");
const fs = require("node:fs");
const Module = require("node:module");
const localBackendModules = path.resolve(__dirname, "../../backend/backend/node_modules");
if (fs.existsSync(localBackendModules) && !process.env.VERCEL) {
  process.env.NODE_PATH = [process.env.NODE_PATH, localBackendModules].filter(Boolean).join(path.delimiter);
  Module._initPaths();
}
require("dotenv").config({ path: path.resolve(__dirname, "../../backend/backend/.env") });

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const PORT = Number(process.env.PORT) || 5000;
const MODEL = "gemini-3.5-flash-lite";
const INVALID_AI_RESPONSE = "The AI returned an invalid response. Please try again.";
const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts", "YouTube", "Facebook", "LinkedIn"];
const languages = ["Somali", "English", "Arabic", "Somali + English"];
const styles = ["Professional", "Educational", "Storytelling", "Energetic", "Friendly", "News", "Business", "Gen-Z", "Inspirational"];
const audiences = ["Students", "Somali university students", "Creators", "Businesses", "Professionals", "General Audience"];
const goals = ["Education", "Engagement", "Growth", "Sales", "Leads", "Brand Awareness", "Followers", "Traffic", "Community"];
const durations = ["15 sec", "30 sec", "45 sec", "60 sec", "60 seconds", "90 sec", "3 min", "5 min", "10 min", "45–60 sec"];
const actions = ["ideas", "complete_content", "hook", "script", "scenes", "filming", "visuals", "broll", "onscreen_text", "caption", "cta", "hashtags", "title", "thumbnail", "repurpose", "carousel", "calendar", "strategy", "analyze", "business", "personal_brand", "ai_tech"];

const sharedRules = `
You are SooSaare AI, a professional AI content strategist for Somali creators and businesses.
Write for the requested language and platform. Use natural, fluent phrasing and avoid generic filler.
For Somali, write natural Somali and avoid unnecessary English. Make spoken scripts easy to say aloud.
For English or Arabic, write naturally in that language and use the appropriate writing system.
For Somali + English, code-switch naturally only where it improves clarity and matches the audience.
Adapt pacing, framing, caption, and CTA to the selected platform.
For short-form video, target a 45–60 second spoken script unless the user asks for a different length.
Start with a strong hook that earns attention within the first three seconds. Make the advice specific and useful.
Use practical, filmable visual suggestions, a relevant CTA, and relevant hashtags.
Return only the JSON object matching the required response schema. Do not use Markdown fences.
`;

const platformGuidance = {
  TikTok: "Optimize for vertical 9:16, a fast opening, short scenes, and retention.",
  "Instagram Reels": "Use visual-first vertical 9:16 framing, shareable beats, and a concise caption.",
  "YouTube Shorts": "Use vertical 9:16 framing, a clear structure, and a strong searchable title.",
  YouTube: "Use a clear long-form structure with sections, viewer retention beats, title, and thumbnail concept.",
  Facebook: "Keep it accessible, community-oriented, and easy to share.",
  LinkedIn: "Use a professional, credible, educational, business-focused tone.",
};

const ideasSchema = {
  type: "OBJECT",
  properties: {
    ideas: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          angle: { type: "STRING" },
          hook: { type: "STRING" },
          audience: { type: "STRING" },
          format: { type: "STRING" },
          whyItWorks: { type: "STRING" },
        },
        required: ["title", "angle", "hook", "audience", "format", "whyItWorks"],
      },
    },
  },
  required: ["ideas"],
};

const contentSchema = {
  type: "OBJECT",
  properties: {
    hook: { type: "STRING" },
    script: { type: "STRING" },
    visuals: { type: "ARRAY", items: { type: "STRING" } },
    caption: { type: "STRING" },
    cta: { type: "STRING" },
    hashtags: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["hook", "script", "visuals", "caption", "cta", "hashtags"],
};

const sceneSchema = {
  type: "OBJECT",
  properties: {
    sceneNumber: { type: "INTEGER" }, duration: { type: "STRING" }, voiceover: { type: "STRING" },
    action: { type: "STRING" }, camera: { type: "STRING" }, shotType: { type: "STRING" },
    cameraMovement: { type: "STRING" }, location: { type: "STRING" }, performance: { type: "STRING" },
    visual: { type: "STRING" }, broll: { type: "STRING" }, onScreenText: { type: "STRING" },
    transition: { type: "STRING" }, editingNote: { type: "STRING" },
  },
  required: ["sceneNumber", "duration", "voiceover", "action", "camera", "shotType", "cameraMovement", "location", "performance", "visual", "broll", "onScreenText", "transition", "editingNote"],
};

const completeSchema = {
  type: "OBJECT",
  properties: {
    idea: { type: "STRING" }, angle: { type: "STRING" }, audience: { type: "STRING" }, goal: { type: "STRING" },
    platform: { type: "STRING" }, language: { type: "STRING" }, style: { type: "STRING" }, duration: { type: "STRING" },
    strategy: { type: "STRING" }, hook: { type: "STRING" }, script: { type: "STRING" },
    scenes: { type: "ARRAY", items: sceneSchema },
    filmingPlan: { type: "ARRAY", items: { type: "STRING" } },
    visuals: { type: "ARRAY", items: { type: "STRING" } },
    broll: { type: "ARRAY", items: { type: "STRING" } },
    onScreenText: { type: "ARRAY", items: { type: "STRING" } },
    editingPlan: { type: "ARRAY", items: { type: "STRING" } },
    caption: { type: "STRING" }, cta: { type: "STRING" }, hashtags: { type: "ARRAY", items: { type: "STRING" } },
    title: { type: "STRING" }, thumbnail: { type: "STRING" }, postingRecommendation: { type: "STRING" },
  },
  required: ["idea", "angle", "audience", "goal", "platform", "language", "style", "duration", "strategy", "hook", "script", "scenes", "filmingPlan", "visuals", "broll", "onScreenText", "editingPlan", "caption", "cta", "hashtags", "title", "thumbnail", "postingRecommendation"],
};

const toolSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" }, summary: { type: "STRING" },
    sections: { type: "ARRAY", items: { type: "OBJECT", properties: {
      heading: { type: "STRING" }, content: { type: "STRING" }, items: { type: "ARRAY", items: { type: "STRING" } },
    }, required: ["heading", "content", "items"] } },
  },
  required: ["title", "summary", "sections"],
};

const actionNames = {
  hook: "Hook Studio", script: "Script Studio", scenes: "Scene & Shot Planner", filming: "Filming Mode",
  visuals: "Visual Planner", broll: "B-Roll Studio", onscreen_text: "On-Screen Text", caption: "Caption Studio",
  cta: "CTA Generator", hashtags: "Hashtag Studio", title: "Title Studio", thumbnail: "Thumbnail Studio",
  carousel: "Carousel Studio", calendar: "Content Calendar", strategy: "Content Strategy", analyze: "Content Analyzer",
  business: "Business Content", personal_brand: "Personal Brand Studio", ai_tech: "AI & Tech Studio",
};

const actionGuidance = {
  hook: "Generate 12 distinct hooks: curiosity, question, problem, surprising insight, contrarian, story, statistic, mistake, secret, bold claim, urgency, and personal experience. Give each a label and short hook text.",
  script: "Write a natural spoken script with clearly separated HOOK, INTRO, MAIN CONTENT, TRANSITIONS, ENDING, and CTA. Make it specific to the supplied style and duration.",
  scenes: "Break the content into immediately filmable scenes. Each section must specify scene number, duration, voiceover, creator action, camera framing, shot type, movement, location, performance, visual, B-roll, on-screen text, transition, and editing note.",
  filming: "Create a solo-creator smartphone filming plan: preparation, location, lighting, vertical phone setup, tripod position, framing, shot list, actions, body language, expression, speaking pace, camera movement, and B-roll.",
  visuals: "Give concrete visual direction for each beat: what appears, what the creator does, what the camera captures, and exact supporting B-roll. Avoid vague suggestions.",
  broll: "Create at least 8 practical B-roll shots, each with an actionable shot description, shot type, duration, camera direction, and purpose.",
  onscreen_text: "Create concise, readable, relevant overlays timed to each scene. Include the exact text and when it appears; avoid long sentences.",
  caption: "Write 3 distinct platform-native captions with a strong first line, useful context, natural tone, and appropriate length.",
  cta: "Write 10 specific calls to action matched to the requested content goal, including low-friction engagement and conversion options.",
  hashtags: "Suggest 15 relevant hashtags grouped into broad reach, niche, and Somali/community discovery. Avoid unrelated or spammy tags.",
  title: "Write 10 accurate, compelling, platform-aware titles. Do not use misleading clickbait.",
  thumbnail: "Develop 3 thumbnail concepts. For each, specify composition, subject expression/action, background, contrast, and short readable overlay text.",
  carousel: "Create a 7–10 slide carousel with a cover, one clear idea per slide, concise on-slide copy, visual direction, and final CTA.",
  calendar: "Create a practical 7-day content calendar with day, topic, format, hook, goal, and suggested publishing window. Do not claim exact best posting times as fact.",
  strategy: "Build a focused content strategy: positioning, audience needs, 3 content pillars, formats, cadence, engagement loop, and measurable 30-day experiments.",
  analyze: "Analyze only the supplied content. Return strengths, clarity, audience fit, hook effectiveness, retention risks, platform fit, specific improvements, and a revised opening. State when source data is insufficient.",
  business: "Create a truthful business content package focused on the supplied product/service. Do not invent pricing, guarantees, testimonials, or unsupported claims.",
  personal_brand: "Create a relatable personal-brand story/content outline grounded only in details the user supplied. Do not invent life events or credentials.",
  ai_tech: "Create an accurate, accessible AI/technology explainer. Distinguish provided facts from assumptions and avoid making unsupported current-news claims.",
};

function getPrompt({ mode, topic, platform, language }) {
  const context = `\nSelected platform: ${platform}\nSelected language: ${language}\n`;

  if (mode === "ideas") {
    return `${sharedRules}${context}
The user wants content ideas about this topic or niche:
<topic>${topic}</topic>

Generate exactly 10 distinct, useful ideas that fit the audience and platform. Each needs a specific title, concise angle, compelling opening hook, audience, suitable format, and a short explanation of why it works. Avoid repeating concepts.
`;
  }

  if (mode === "idea") {
    return `${sharedRules}${context}
Turn this user idea into one complete, ready-to-publish content package:
<idea>${topic}</idea>
Include a concise hook, spoken script, practical scene-by-scene visuals, platform-appropriate caption, relevant CTA, and 5–8 useful hashtags.
`;
  }

  if (mode === "repurpose") {
    return `${sharedRules}${context}
Transform the following existing content into a fresh piece suited to the selected platform. Preserve its main message and factual meaning. Do not invent claims or merely copy the source wording. Include a new hook, spoken script, practical scene-by-scene visuals, caption, CTA, and 5–8 relevant hashtags.
<source_content>${topic}</source_content>
`;
  }

  return null;
}

function getActionPrompt({ action, topic, platform, language, style, audience, goal, duration, context }) {
  const platformRule = platformGuidance[platform] || "Adapt the format to the selected platform.";
  if (action === "ideas") return `${sharedRules}\n${platformRule}\nGenerate exactly 10 distinct ideas for the requested audience, platform, and goal. For each provide title, angle, hook, audience, format, and why it works.\nTopic or niche: ${topic}\nAudience: ${audience}\nGoal: ${goal}\nPlatform: ${platform}\nLanguage: ${language}`;
  if (action === "complete_content" || action === "repurpose") return `${sharedRules}
Create a complete, coherent, ready-to-produce content package. All sections must derive from the same idea. Adapt to platform ${platform} (${platformRule}), language ${language}, style ${style}, audience ${audience}, goal ${goal}, and requested duration ${duration}.
Topic or source content: <source>${topic}</source>
${context ? `Additional creator context: ${context}` : ""}
Structure the spoken script with clear HOOK, INTRO, MAIN CONTENT, TRANSITIONS, ENDING, and CTA beats. Include 4–8 practical scenes. Every scene must include all schema fields. Provide a solo filming plan, concrete visuals and B-roll, concise scene overlays, editing steps, a native caption, CTA, relevant hashtags, platform-specific title and thumbnail, and a realistic posting recommendation. Preserve the main message when repurposing. Do not invent facts.
`;
  const toolName = actionNames[action] || action;
  return `${sharedRules}
You are operating the ${toolName} for this SooSaare AI content workspace.
User's topic, source, or existing draft: <source>${topic}</source>
Platform: ${platform} (${platformRule}); language: ${language}; style: ${style}; audience: ${audience}; goal: ${goal}; duration: ${duration}.
${context ? `Existing shared content context (preserve and use it): ${context}` : ""}
${actionGuidance[action] || "Create specific and actionable content for the requested topic."}
Return sections that are useful, concrete, and directly relevant to the user's source. Each section should have a concise heading, a short content field, and an items array for steps or variations.
`;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateContent(content, mode) {
  if (!content || typeof content !== "object" || Array.isArray(content)) return false;

  if (mode === "ideas") {
    return Array.isArray(content.ideas) && content.ideas.length === 10 &&
      content.ideas.every((idea) => idea && isNonEmptyString(idea.title) &&
        isNonEmptyString(idea.angle) && isNonEmptyString(idea.hook));
  }

  return isNonEmptyString(content.hook) && isNonEmptyString(content.script) &&
    Array.isArray(content.visuals) && content.visuals.length > 0 &&
    content.visuals.every(isNonEmptyString) && isNonEmptyString(content.caption) &&
    isNonEmptyString(content.cta) && Array.isArray(content.hashtags) &&
    content.hashtags.length > 0 && content.hashtags.every(isNonEmptyString);
}

function validateActionContent(content, action) {
  if (action === "ideas") {
    return Array.isArray(content?.ideas) && content.ideas.length === 10 && content.ideas.every((idea) =>
      idea && ["title", "angle", "hook", "audience", "format", "whyItWorks"].every((key) => isNonEmptyString(idea[key])));
  }
  if (action === "complete_content" || action === "repurpose") {
    const fields = ["idea", "angle", "audience", "goal", "platform", "language", "style", "duration", "strategy", "hook", "script", "caption", "cta", "title", "thumbnail", "postingRecommendation"];
    return fields.every((field) => isNonEmptyString(content?.[field])) && Array.isArray(content.scenes) && content.scenes.length > 0 &&
      content.scenes.every((scene) => scene && ["duration", "voiceover", "action", "camera", "shotType", "cameraMovement", "location", "performance", "visual", "broll", "onScreenText", "transition", "editingNote"].every((key) => isNonEmptyString(scene[key]))) &&
      ["filmingPlan", "visuals", "broll", "onScreenText", "editingPlan", "hashtags"].every((field) => Array.isArray(content[field]) && content[field].length > 0 && content[field].every(isNonEmptyString));
  }
  return isNonEmptyString(content?.title) && isNonEmptyString(content?.summary) && Array.isArray(content.sections) &&
    content.sections.length > 0 && content.sections.every((section) => section && isNonEmptyString(section.heading) &&
      (isNonEmptyString(section.content) || (Array.isArray(section.items) && section.items.length > 0)) &&
      Array.isArray(section.items) && section.items.every(isNonEmptyString));
}

function createApp() {
  const app = express();
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_ORIGIN,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  ]
    .filter(Boolean).flatMap((value) => value.split(",").map((origin) => origin.trim()).filter(Boolean));
  const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    ...configuredOrigins,
  ]);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
  }));
  app.use(express.json({ limit: "32kb" }));

  app.get("/", (_req, res) => {
    res.json({ service: "SooSaare AI API", status: "ready" });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ service: "SooSaare AI API", status: "ready" });
  });

  app.post("/api/generate", async (req, res) => {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: "Please provide a valid JSON request." });
    }

    const { topic, platform = "TikTok", language = "Somali", mode = "idea", action, style = "Educational", audience = "General Audience", goal = "Engagement", duration = "45–60 sec", context = "" } = body;
    const selectedAction = action || (mode === "idea" ? "complete_content" : mode);
    if (!isNonEmptyString(topic)) {
      return res.status(400).json({ error: "Please provide a topic." });
    }
    if (topic.length > 10000) {
      return res.status(400).json({ error: "Topic must be 10,000 characters or fewer." });
    }
    if (!platforms.includes(platform)) {
      return res.status(400).json({ error: "Please select a supported platform." });
    }
    if (!languages.includes(language)) {
      return res.status(400).json({ error: "Please select a supported language." });
    }
    if (!actions.includes(selectedAction) || !(["ideas", "idea", "repurpose", "complete_content"].includes(mode) || actions.includes(mode))) {
      return res.status(400).json({ error: "Please select a supported content workflow." });
    }
    if (!styles.includes(style) || !audiences.includes(audience) || !goals.includes(goal) || !durations.includes(duration) || typeof context !== "string" || context.length > 12000) {
      return res.status(400).json({ error: "Please provide valid content settings." });
    }
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured in backend/backend/.env");
      return res.status(503).json({ error: "AI generation is temporarily unavailable. Please try again later." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { timeout: 110000 } });
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: getActionPrompt({ action: selectedAction, topic: topic.trim(), platform, language, style, audience, goal, duration, context }),
        config: {
          responseMimeType: "application/json",
          responseSchema: selectedAction === "ideas" ? ideasSchema : selectedAction === "complete_content" || selectedAction === "repurpose" ? completeSchema : toolSchema,
          temperature: 0.8,
        },
      });

      let content;
      try {
        if (typeof response.text !== "string" || !response.text.trim()) throw new Error("Empty AI response");
        content = JSON.parse(response.text);
      } catch (error) {
        console.error("Gemini returned invalid JSON:", error.message);
        return res.status(502).json({ error: INVALID_AI_RESPONSE });
      }

      const responseValid = validateActionContent(content, selectedAction);
      if (!responseValid) {
        console.error(`Gemini response did not match the ${selectedAction} response contract.`);
        return res.status(502).json({ error: INVALID_AI_RESPONSE });
      }

      return res.json({ success: true, mode, action: selectedAction, platform, language, content });
    } catch (error) {
      console.error("Gemini generation failed:", error);
      if (error.status === 429 || error.code === 429) {
        return res.status(429).json({ error: "AI is receiving too many requests. Please wait a moment and try again." });
      }
      if (error.name === "AbortError" || error.name === "TimeoutError") {
        return res.status(504).json({ error: "AI generation timed out. Please try again." });
      }
      return res.status(502).json({ error: "Content generation failed. Please try again." });
    }
  });

  app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      return res.status(400).json({ error: "Please provide valid JSON." });
    }
    if (error.type === "entity.too.large") {
      return res.status(413).json({ error: "Request is too large." });
    }
    if (error.message === "Origin is not allowed by CORS.") {
      return res.status(403).json({ error: "This application origin is not allowed." });
    }
    console.error("Unhandled API error:", error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  });

  return app;
}

if (require.main === module) {
  createApp().listen(PORT, () => {
    console.log(`SooSaare AI API listening on http://localhost:${PORT}`);
  });
}

module.exports = { createApp, getPrompt, getActionPrompt, validateContent, validateActionContent, ideasSchema, contentSchema, completeSchema, toolSchema };
