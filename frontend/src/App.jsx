import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = (import.meta.env.DEV ? import.meta.env.VITE_API_URL || "" : "").trim().replace(/\/+$/, "");

const workflows = [
  {
    id: "ideas",
    title: "Ideas",
    description: "Find your next great idea",
    icon: "✦",
  },
  {
    id: "idea",
    title: "Create",
    description: "Turn an idea into content",
    icon: "↗",
  },
  {
    id: "repurpose",
    title: "Repurpose",
    description: "Give existing content a new life",
    icon: "◈",
  },
];

const platforms = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "YouTube",
  "Facebook",
  "LinkedIn",
];

const languages = ["Somali", "English", "Arabic", "Somali + English"];

const contentTools = [
  ["hook", "Hook Studio", "⚡"], ["script", "Script Studio", "✦"], ["scenes", "Scene & Shot Planner", "🎬"],
  ["filming", "Filming Mode", "🎥"], ["visuals", "Visual Planner", "🎨"], ["broll", "B-Roll Studio", "▣"],
  ["onscreen_text", "On-Screen Text", "Aa"], ["caption", "Caption Studio", "✎"], ["cta", "CTA Generator", "↗"],
  ["hashtags", "Hashtag Studio", "#"], ["title", "Title Studio", "T"], ["thumbnail", "Thumbnail Studio", "▧"],
  ["carousel", "Carousel Studio", "▤"], ["calendar", "Content Calendar", "▦"], ["strategy", "Content Strategy", "◉"],
  ["analyze", "Content Analyzer", "⌁"], ["business", "Business Content", "◫"], ["personal_brand", "Personal Brand", "A"],
  ["ai_tech", "AI & Tech Studio", "✧"],
];

const contentStyles = ["Professional", "Educational", "Storytelling", "Energetic", "Friendly", "News", "Business", "Gen-Z", "Inspirational"];
const audiences = ["Students", "Somali university students", "Creators", "Businesses", "Professionals", "General Audience"];
const goals = ["Education", "Engagement", "Growth", "Sales", "Leads", "Brand Awareness", "Followers", "Traffic", "Community"];
const durations = ["15 sec", "30 sec", "45 sec", "60 sec", "60 seconds", "90 sec", "3 min", "5 min", "10 min"];

const templates = [
  {
    id: 1,
    title: "3 Things You Should Know",
    category: "Education",
    icon: "🎓",
    description: "Turn any topic into three simple and useful points.",
    prompt: "Create an educational short-form video explaining 3 important things people should know about ",
  },
  {
    id: 2,
    title: "Quick Tips",
    category: "Education",
    icon: "💡",
    description: "Create short, practical tips people can use immediately.",
    prompt: "Create a short educational video with 5 practical tips about ",
  },
  {
    id: 3,
    title: "Explain It Simply",
    category: "Education",
    icon: "📚",
    description: "Explain a difficult topic in a simple, beginner-friendly way.",
    prompt: "Explain this topic in a very simple and beginner-friendly way: ",
  },
  {
    id: 4,
    title: "Myth vs Fact",
    category: "Education",
    icon: "⚡",
    description: "Turn common misconceptions into engaging content.",
    prompt: "Create a Myth vs Fact short video about ",
  },
  {
    id: 5,
    title: "Viral Hook",
    category: "Social Media",
    icon: "🔥",
    description: "Create a powerful opening that grabs attention immediately.",
    prompt: "Create a viral short-form video with a powerful 3-second hook about ",
  },
  {
    id: 6,
    title: "Storytelling",
    category: "Social Media",
    icon: "🎬",
    description: "Turn an idea into an engaging story with a strong ending.",
    prompt: "Create an emotional and engaging storytelling video about ",
  },
  {
    id: 7,
    title: "Q&A",
    category: "Social Media",
    icon: "❓",
    description: "Answer a common question in an engaging short video.",
    prompt: "Create a Q&A style short-form video answering the question about ",
  },
  {
    id: 8,
    title: "Listicle",
    category: "Social Media",
    icon: "📝",
    description: "Create numbered content that is easy to watch and remember.",
    prompt: "Create a numbered list-style short video about ",
  },
  {
    id: 9,
    title: "Business Promotion",
    category: "Business",
    icon: "💼",
    description: "Promote a business with a professional short-form video.",
    prompt: "Create a professional business promotion video for ",
  },
  {
    id: 10,
    title: "Service Advertisement",
    category: "Business",
    icon: "📢",
    description: "Turn a service into a clear and persuasive advertisement.",
    prompt: "Create a persuasive advertisement for this service: ",
  },
  {
    id: 11,
    title: "Customer Testimonial",
    category: "Business",
    icon: "⭐",
    description: "Highlight customer experience and build trust.",
    prompt: "Create a customer testimonial style video about ",
  },
  {
    id: 12,
    title: "Special Offer",
    category: "Business",
    icon: "🏷️",
    description: "Promote a discount, campaign or special offer.",
    prompt: "Create an exciting promotional video for this special offer: ",
  },
  {
    id: 13,
    title: "My Story",
    category: "Personal Brand",
    icon: "👤",
    description: "Share your personal journey and build a stronger connection.",
    prompt: "Create a personal brand storytelling video about my journey with ",
  },
  {
    id: 14,
    title: "Day in My Life",
    category: "Personal Brand",
    icon: "☀️",
    description: "Turn your daily routine into engaging personal content.",
    prompt: "Create a Day in My Life style video about ",
  },
  {
    id: 15,
    title: "What I Learned",
    category: "Personal Brand",
    icon: "🧠",
    description: "Share lessons and experiences with your audience.",
    prompt: "Create a personal brand video sharing what I learned about ",
  },
  {
    id: 16,
    title: "Behind the Scenes",
    category: "Personal Brand",
    icon: "🎥",
    description: "Show the process behind your work, project or business.",
    prompt: "Create a behind-the-scenes video showing the process of ",
  },
  {
    id: 17,
    title: "AI News",
    category: "AI & Tech",
    icon: "🤖",
    description: "Turn an AI update or news story into engaging content.",
    prompt: "Create a short AI technology news video explaining the latest update about ",
  },
  {
    id: 18,
    title: "AI Tool Review",
    category: "AI & Tech",
    icon: "🛠️",
    description: "Review an AI tool and explain why people should care.",
    prompt: "Create an AI tool review video about ",
  },
  {
    id: 19,
    title: "Tech Tips",
    category: "AI & Tech",
    icon: "💻",
    description: "Share useful technology tips in a short and engaging format.",
    prompt: "Create a short technology tips video about ",
  },
  {
    id: 20,
    title: "How AI Works",
    category: "AI & Tech",
    icon: "⚙️",
    description: "Explain an AI concept in a simple way.",
    prompt: "Explain how this AI technology works in a simple way: ",
  },
  {
    id: 21,
    title: "Customer Problem to Solution",
    category: "Marketing",
    icon: "↗",
    description: "Show a clear customer problem and how a product or service can help.",
    prompt: "Create a useful marketing video that explains the customer problem and how this product or service helps: ",
  },
  {
    id: 22,
    title: "Campaign Announcement",
    category: "Marketing",
    icon: "✦",
    description: "Introduce a campaign with one clear message and next step.",
    prompt: "Create a clear social campaign announcement with a strong message and call to action about: ",
  },
];

function App() {
  const [activeNav, setActiveNav] = useState("Create");
  const [mode, setMode] = useState("idea");

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [language, setLanguage] = useState("Somali");
  const [style, setStyle] = useState("Educational");
  const [audience, setAudience] = useState("General Audience");
  const [goal, setGoal] = useState("Engagement");
  const [duration, setDuration] = useState("45 sec");

  const [content, setContent] = useState(null);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiOnline, setAiOnline] = useState(false);
  const [aiStatus, setAiStatus] = useState("checking");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const [library, setLibrary] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("soosaare-library") || "[]");
      return Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === "number" && typeof item.title === "string" && typeof item.topic === "string" && item.content && typeof item.content === "object") : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [libraryFilter, setLibraryFilter] = useState("All");

  useEffect(() => {
    try {
      localStorage.setItem("soosaare-library", JSON.stringify(library));
    } catch { /* Browser storage can be unavailable or full. */ }
  }, [library]);

  useEffect(() => {
    let active = true;
    let timer;
    const checkHealth = async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);
      let response;
      try {
        response = await fetch(`${API_URL}/api/health`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Health request failed (${response.status})`);
        const data = await response.json();
        if (active) {
          const ready = data && (data.status === "ready" || data.status === "ok");
          setAiOnline(ready);
          setAiStatus(ready ? "ready" : "error");
        }
      } catch (error) {
        console.error("AI health check failed:", error);
        if (active) {
          setAiOnline(false);
          setAiStatus(response?.ok ? "error" : "offline");
        }
      } finally {
        window.clearTimeout(timeout);
        if (active) timer = window.setTimeout(checkHealth, 30000);
      }
    };
    checkHealth();
    return () => { active = false; window.clearTimeout(timer); };
  }, []);

  // ======================================================
  // GENERATE
  // ======================================================

  const handleGenerate = async (requestedAction = "") => {
    if (!topic.trim()) {
      setError(
        mode === "repurpose"
          ? "Paste your existing content first."
          : "Tell SooSaare what you want to create."
      );
      return;
    }
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const requestTimeout = window.setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(
        `${API_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            topic,
            platform,
            language,
            mode: requestedAction ? (requestedAction === "ideas" ? "ideas" : "idea") : mode,
            ...(requestedAction ? { action: requestedAction } : {}),
            style,
            audience,
            goal,
            duration,
            context: content ? JSON.stringify(content).slice(0, 12000) : "",
          }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an unreadable response. Please try again.");
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Content generation failed. Please try again."
        );
      }

      const responseMode = requestedAction || mode;
      const validIdeas = responseMode === "ideas" && Array.isArray(data?.content?.ideas) &&
        data.content.ideas.length === 10 && data.content.ideas.every((idea) =>
          idea && typeof idea.title === "string" && typeof idea.angle === "string" && typeof idea.hook === "string");
      const validTool = requestedAction && !["ideas", "complete_content", "repurpose"].includes(requestedAction) &&
        Array.isArray(data?.content?.sections) && data.content.sections.length > 0;
      const validComplete = ["complete_content", "repurpose"].includes(requestedAction) && data?.content &&
        typeof data.content.hook === "string" && Array.isArray(data.content.scenes) && data.content.scenes.length > 0;
      const validPackage = !requestedAction && responseMode !== "ideas" && data?.content &&
        typeof data.content.hook === "string" && typeof data.content.script === "string" &&
        Array.isArray(data.content.visuals) && Array.isArray(data.content.hashtags) &&
        typeof data.content.caption === "string" && typeof data.content.cta === "string";
      if (!validIdeas && !validPackage && !validTool && !validComplete) {
        throw new Error("The server returned an incomplete content package. Please try again.");
      }

      if (requestedAction && !["ideas", "complete_content", "repurpose"].includes(requestedAction)) {
        setContent((current) => ({ ...(current || {}), tools: { ...(current?.tools || {}), [requestedAction]: data.content } }));
      } else if (requestedAction === "ideas") {
        setContent((current) => ({ ...(current || {}), ideas: data.content.ideas }));
      } else {
        setContent((current) => {
          const { ideas: _previousIdeas, ...currentContent } = current || {};
          return { ...currentContent, ...data.content, tools: current?.tools || {} };
        });
      }
      return data.content;
    } catch (err) {
      setError(err.name === "AbortError"
        ? "This request timed out. Please try again."
        : err instanceof TypeError
          ? "Could not reach the SooSaare API. Check that the backend is running and VITE_API_URL is configured."
          : err.message || "Content generation failed. Please try again.");
    } finally {
      window.clearTimeout(requestTimeout);
      setLoading(false);
    }
  };

  // ======================================================
  // COPY
  // ======================================================

  const copyText = async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      notify("Copied to clipboard");
    } catch {
      notify("Clipboard access is unavailable");
    }
  };

  const copyAll = async () => {
    if (!content) return;

    if (content.ideas) {
      const text = content.ideas
        .map(
          (idea, index) =>
            `${index + 1}. ${idea.title}\n${idea.angle}\nHook: ${idea.hook}\nAudience: ${idea.audience || ""}\nFormat: ${idea.format || ""}\nWhy it works: ${idea.whyItWorks || ""}`
        )
        .join("\n\n");

      await copyText(text);
      return;
    }

    const text = `
HOOK
${content.hook || ""}

SCRIPT
${content.script || ""}

VISUAL PLAN
${content.visuals?.join("\n") || ""}

CAPTION
${content.caption || ""}

CTA
${content.cta || ""}

HASHTAGS
${content.hashtags?.join(" ") || ""}
`.trim();

    await copyText(text);
  };

  // ======================================================
  // SAVE
  // ======================================================

  const saveContent = () => {
    if (!content) return;

    if (library.some((item) => JSON.stringify(item.content) === JSON.stringify(content))) {
      notify("This content is already saved");
      return;
    }

    const item = {
      id: Date.now(),
      title:
        content.hook ||
        topic.slice(0, 60) ||
        "Untitled content",
      topic,
      platform,
      language,
      content,
      favorite: false,
      createdAt: new Date().toISOString(),
    };

    setLibrary((prev) => [item, ...prev]);
    notify("Saved to your library");
  };

  const saveIdea = (idea) => {
    const item = { id: Date.now(), title: idea.title, topic, platform, language, content: { ideas: [idea] }, favorite: false, createdAt: new Date().toISOString() };
    setLibrary((items) => [item, ...items]);
    notify("Idea saved to your library");
  };

  const deleteContent = (id) => {
    if (!window.confirm("Delete this saved content? This cannot be undone.")) return;
    setLibrary((prev) =>
      prev.filter((item) => item.id !== id)
    );
    notify("Content deleted");
  };

  const toggleFavorite = (id) => {
    setLibrary((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite: !item.favorite,
            }
          : item
      )
    );
  };

  const openLibraryItem = (item) => {
    setContent(item.content);
    setTopic(item.topic);
    setPlatform(item.platform);
    setLanguage(item.language);
    setSelectedLibraryId(item.id);
    setActiveNav("Create");
    setMode("idea");
  };

  // ======================================================
  // USE IDEA
  // ======================================================

  const useIdea = (idea) => {
    setTopic(idea.title);
    setMode("idea");
    setContent(null);
    setSelectedLibraryId(null);
    setActiveNav("Create");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // USE TEMPLATE
  // ======================================================

  const useTemplate = (template) => {
    setTopic(`${template.prompt} `);
    setMode("idea");
    setContent(null);
    setSelectedLibraryId(null);
    setActiveNav("Create");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // NAVIGATION
  // ======================================================

  const navigate = (page) => {
    setActiveNav(page);
    setError("");
    if (page === "Create") {
      setContent(null);
      setSelectedLibraryId(null);
    }
  };

  const editContent = (field, value) => {
    setContent((current) => ({ ...(current || {}), [field]: value }));
    if (selectedLibraryId) setLibrary((items) => items.map((item) => item.id === selectedLibraryId
      ? { ...item, content: { ...item.content, [field]: value }, title: field === "hook" ? value : item.title }
      : item));
  };

  const regenerateSection = async (field, action) => {
    const generated = await handleGenerate(action);
    if (!generated) return;
    if (action === "complete_content") {
      if (generated[field] !== undefined) editContent(field, generated[field]);
      return;
    }
    const sections = generated.sections || [];
    const value = ["hashtags", "broll", "visuals", "onScreenText", "editingPlan", "filmingPlan"].includes(field)
      ? sections.flatMap((section) => [section.content, ...section.items]).filter(Boolean)
      : sections.map((section) => [section.content, ...section.items].filter(Boolean).join("\n")).join("\n\n");
    if (value) editContent(field, value);
  };

  const filteredLibrary = useMemo(() => {
    return library.filter((item) => {
      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.topic
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFavorite = libraryFilter !== "Favorites" || item.favorite;
      const matchesRecent = libraryFilter !== "Recent" || library.indexOf(item) < 10;

      return matchesSearch && matchesFavorite && matchesRecent;
    });
  }, [library, search, libraryFilter]);

  return (
    <div className="app">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="sidebar">

        <div className="logo-area">
          <div className="logo">S</div>

          <div>
            <strong>SooSaare</strong>
            <span>Creator Studio</span>
          </div>
        </div>

        <nav>
          <div className="nav-label">
            WORKSPACE
          </div>

          <button
            className={`nav-item ${
              activeNav === "Create" ? "active" : ""
            }`}
            onClick={() => navigate("Create")}
          >
            <span>✦</span>
            Create
          </button>

          <button
            className={`nav-item ${
              activeNav === "Library" ? "active" : ""
            }`}
            onClick={() => navigate("Library")}
          >
            <span>□</span>
            Library

            {library.length > 0 && (
              <small className="nav-count">
                {library.length}
              </small>
            )}
          </button>

          <button
            className={`nav-item ${
              activeNav === "Templates" ? "active" : ""
            }`}
            onClick={() => navigate("Templates")}
          >
            <span>◫</span>
            Templates
          </button>
        </nav>

        <nav className="tool-nav" aria-label="Content tools">
          <div className="nav-label nav-label-spaced">CONTENT TOOLS</div>
          {contentTools.map(([action, label, icon]) => (
            <button key={action} className={`nav-item ${activeNav === action ? "active" : ""}`} onClick={() => navigate(action)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">

          <div className="ai-status">
            <span className={`status-dot ${loading ? "loading-indicator" : aiOnline ? "" : "offline"}`}></span>

            <div>
              <strong>
                {loading ? "Creating..." : aiStatus === "checking" ? "Checking..." : aiStatus === "ready" ? "AI Ready" : aiStatus === "error" ? "AI Error" : "AI Offline"}
              </strong>

              <small>
                {loading
                  ? "SooSaare is working"
                    : aiStatus === "checking" ? "Checking backend connection" : aiStatus === "ready" ? "Connected to SooSaare API" : aiStatus === "error" ? "Backend returned an unexpected health response" : "Backend connection unavailable"}
              </small>
            </div>
          </div>

          <button
            className="profile"
            onClick={() =>
              setActiveNav("Profile")
            }
          >
            <div className="profile-avatar">
              A
            </div>

            <div>
              <strong>Asma</strong>
              <small>Creator</small>
            </div>

            <span className="profile-more">
              •••
            </span>
          </button>

        </div>
      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="main">

        <header className="topbar">

          <div>
            <select className="mobile-page-select" aria-label="Choose workspace page" value={activeNav} onChange={(event) => navigate(event.target.value)}>
              {[['Create', 'Create'], ['Library', 'Library'], ['Templates', 'Templates'], ['Profile', 'Profile'], ...contentTools.map(([id, label]) => [id, label])].map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
            <span className="breadcrumb">
              Workspace
            </span>

            <span className="slash">/</span>

            <strong>{contentTools.find(([id]) => id === activeNav)?.[1] || activeNav}</strong>
          </div>

          <div className="top-actions">
            <span className="top-status"><span className={`status-dot ${aiOnline ? "" : "offline"}`} /> {aiStatus === "checking" ? "Checking..." : aiStatus === "ready" ? "AI Ready" : aiStatus === "error" ? "AI Error" : "AI Offline"}</span>
            <span className="top-help">Help</span>

            <button
              className="top-icon"
              aria-label="Open Asma's profile"
              onClick={() =>
                setActiveNav("Profile")
              }
            >
              A
            </button>
          </div>

        </header>

        <div className="content-area">

          {/* ==================================================
              CREATE
          ================================================== */}

          {activeNav === "Create" && (!content || !(content.ideas || content.hook || content.script)) && (
            <CreatePage
              mode={mode}
              setMode={setMode}
              topic={topic}
              setTopic={setTopic}
              platform={platform}
              setPlatform={setPlatform}
              language={language}
              setLanguage={setLanguage}
              style={style}
              setStyle={setStyle}
              audience={audience}
              setAudience={setAudience}
              goal={goal}
              setGoal={setGoal}
              duration={duration}
              setDuration={setDuration}
              loading={loading}
              aiOnline={aiOnline}
              aiStatus={aiStatus}
              error={error}
              handleGenerate={() => handleGenerate(mode === "ideas" ? "ideas" : mode === "repurpose" ? "repurpose" : "complete_content")}
            />
          )}

          {/* ==================================================
              IDEAS RESULT
          ================================================== */}

          {activeNav === "Create" &&
            content?.ideas && (
              <IdeasResults
                ideas={content.ideas}
                platform={platform}
                language={language}
                onBack={() => setContent(null)}
                onCopy={copyText}
                onCopyAll={copyAll}
                onUseIdea={useIdea}
                onSaveIdea={saveIdea}
                onGenerateMore={() => handleGenerate("ideas")}
                error={error}
              />
            )}

          {/* ==================================================
              CREATE / REPURPOSE RESULT
          ================================================== */}

          {activeNav === "Create" &&
            content &&
            !content.ideas &&
            (content.hook || content.script) && (
              <Results
                content={content}
                platform={platform}
                language={language}
                onCopy={copyText}
                onCopyAll={copyAll}
                onBack={() => setContent(null)}
                onRegenerate={handleGenerate}
                onSave={saveContent}
                onEdit={editContent}
                onRegenerateField={regenerateSection}
                error={error}
                loading={loading}
              />
            )}

          {/* ==================================================
              LIBRARY
          ================================================== */}

          {activeNav === "Library" && (
            <LibraryPage
              library={filteredLibrary}
              search={search}
              setSearch={setSearch}
              filter={libraryFilter}
              setFilter={setLibraryFilter}
              onOpen={openLibraryItem}
              onDelete={deleteContent}
              onFavorite={toggleFavorite}
              onCreate={() => navigate("Create")}
            />
          )}

          {/* ==================================================
              TEMPLATES
          ================================================== */}

          {activeNav === "Templates" && (
            <TemplatesPage
              templates={templates}
              onUse={useTemplate}
            />
          )}

          {/* ==================================================
              PROFILE
          ================================================== */}

          {activeNav === "Profile" && (
            <ProfilePage
              libraryCount={library.length}
              setActiveNav={setActiveNav}
              templateCount={templates.length}
              platform={platform}
              language={language}
              style={style}
              audience={audience}
            />
          )}

          {contentTools.some(([action]) => action === activeNav) && (
            <ToolStudio
              action={activeNav}
              tool={contentTools.find(([id]) => id === activeNav)}
              topic={topic} setTopic={setTopic} platform={platform} setPlatform={setPlatform}
              language={language} setLanguage={setLanguage} style={style} setStyle={setStyle}
              audience={audience} setAudience={setAudience} goal={goal} setGoal={setGoal}
              duration={duration} setDuration={setDuration} result={content?.tools?.[activeNav]}
              loading={loading} error={error} onGenerate={() => handleGenerate(activeNav)} onCopy={copyText}
              onEdit={(result) => { const updated = { ...(content || {}), tools: { ...(content?.tools || {}), [activeNav]: result } }; setContent(updated); if (selectedLibraryId) setLibrary((items) => items.map((item) => item.id === selectedLibraryId ? { ...item, content: updated } : item)); }}
              onUseHook={(hook) => { setContent((current) => ({ ...(current || {}), hook, script: current?.script ? `${hook}\n${current.script}` : hook })); setActiveNav("script"); notify("Hook added to your script context"); }}
              onSave={saveContent}
            />
          )}

        </div>
        <nav className="mobile-nav" aria-label="Main navigation">
          {[['Create', '✦'], ['Library', '▤'], ['Templates', '◫'], ['Profile', 'A']].map(([page, icon]) => (
            <button key={page} className={activeNav === page ? 'active' : ''} onClick={() => navigate(page)}>
              <span>{icon}</span>{page}
            </button>
          ))}
        </nav>
        {toast && <div className="toast" role="status">{toast}</div>}
      </main>
    </div>
  );
}

/* ========================================================
   CREATE PAGE
======================================================== */

function ToolStudio({ action, tool, topic, setTopic, platform, setPlatform, language, setLanguage, style, setStyle, audience, setAudience, goal, setGoal, duration, setDuration, result, loading, error, onGenerate, onCopy, onEdit, onUseHook, onSave }) {
  const [label, title, icon] = tool;
  const updateSection = (index, key, value) => {
    const sections = result.sections.map((section, position) => position === index ? { ...section, [key]: value } : section);
    onEdit({ ...result, sections });
  };

  return <section className="tool-studio">
    <header className="tool-heading"><span className="hero-label">SOOSAARE CONTENT TOOLS</span><h1>{icon} {title}</h1><p>Build this asset from your shared content context. Results stay editable and connected to your workspace.</p></header>
    <div className="creator-panel tool-form">
      <label htmlFor="tool-topic">Topic, idea, or existing content</label>
      <textarea id="tool-topic" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Describe the content you want to create..." />
      <div className="settings tool-settings">
        <div className="setting"><label>Platform</label><select value={platform} onChange={(event) => setPlatform(event.target.value)}>{platforms.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="setting"><label>Language</label><select value={language} onChange={(event) => setLanguage(event.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="setting"><label>Style</label><select value={style} onChange={(event) => setStyle(event.target.value)}>{contentStyles.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="setting"><label>Audience</label><select value={audience} onChange={(event) => setAudience(event.target.value)}>{audiences.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="setting"><label>Goal</label><select value={goal} onChange={(event) => setGoal(event.target.value)}>{goals.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="setting"><label>Duration</label><select value={duration} onChange={(event) => setDuration(event.target.value)}>{durations.map((item) => <option key={item}>{item}</option>)}</select></div>
        <button className="create-button" onClick={onGenerate} disabled={loading}>{loading ? "Generating…" : `Generate ${title}`} <span>↗</span></button>
      </div>
      {error && <div className="error" role="alert">{error}</div>}
    </div>
    {result && <div className="tool-results"><div className="results-top"><h2>{result.title}</h2><div className="result-actions"><button onClick={() => onCopy(result.sections.map((section) => `${section.heading}\n${section.content}\n${section.items.join("\n")}`).join("\n\n"))}>Copy all</button><button onClick={onSave}>Save to Library</button><button className="primary-small" onClick={onGenerate} disabled={loading}>Regenerate</button></div></div><p className="tool-summary">{result.summary}</p>
      {result.sections.map((section, index) => <article className="output-block tool-result-card" key={`${section.heading}-${index}`}><div className="output-header"><div><span>{String(index + 1).padStart(2, "0")} / {label.toUpperCase()}</span><h2>{section.heading}</h2></div><button className="copy-link" onClick={() => onCopy(`${section.content}\n${section.items.join("\n")}`)}>Copy</button></div><textarea aria-label={`Edit ${section.heading}`} value={section.content} onChange={(event) => updateSection(index, "content", event.target.value)} />{section.items.map((item, itemIndex) => <textarea key={itemIndex} aria-label={`Edit ${section.heading} item ${itemIndex + 1}`} value={item} onChange={(event) => { const items = [...section.items]; items[itemIndex] = event.target.value; updateSection(index, "items", items); }} />)}</article>)}
      {action === "hook" && <button className="create-button use-shared-hook" onClick={() => onUseHook(result.sections[0]?.content || result.sections[0]?.items[0] || "")}>Use in Script</button>}
    </div>}
  </section>;
}

function CreatePage({
  mode,
  setMode,
  topic,
  setTopic,
  platform,
  setPlatform,
  language,
  setLanguage,
  style, setStyle, audience, setAudience, goal, setGoal, duration, setDuration,
  loading,
  aiOnline,
  aiStatus,
  error,
  handleGenerate,
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-kicker"><span className="hero-label">SOOSAARE AI · CREATOR STUDIO</span><span className={`ready-badge ${aiOnline ? "" : "offline-badge"}`}><span className={`status-dot ${aiOnline ? "" : "offline"}`} /> {aiStatus === "checking" ? "Checking..." : aiStatus === "ready" ? "AI Ready" : aiStatus === "error" ? "AI Error" : "AI Offline"}</span></div>

        <h1>
          Create content
          <br />
          <em>people remember.</em>
        </h1>

        <p>
          From one idea to a complete content package — hooks, scripts, visuals, captions, CTAs and hashtags.
        </p>
      </section>

      <section className="creator-panel">

        <div className="panel-header">
          <div>
            <span className="step">01</span>

            <div>
              <span className="section-label">
                WORKFLOW
              </span>

              <h2>
                What are you creating?
              </h2>
            </div>
          </div>
        </div>

        <div className="workflow-list">

          {workflows.map((item) => (
            <button
              key={item.id}
              className={`workflow ${
                mode === item.id
                  ? "selected"
                  : ""
              }`}
              onClick={() => setMode(item.id)}
            >
              <div className="workflow-icon">
                {item.icon}
              </div>

              <div className="workflow-text">
                <strong>{item.title}</strong>
                <span>
                  {item.description}
                </span>
              </div>

              <div className="workflow-arrow">
                {mode === item.id
                  ? "✓"
                  : "→"}
              </div>
            </button>
          ))}

        </div>

        <div className="input-section">

          <div className="input-heading">
            <span className="step">02</span>

            <div>
              <span className="section-label">
                YOUR INPUT
              </span>

              <h2>What do you want to create?</h2>
            </div>
          </div>

          <div className="editor">

            <textarea
              aria-label="Describe your topic or existing content"
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              placeholder={
                mode === "ideas"
                  ? "e.g. AI tools every Somali student should know"
                  : mode === "repurpose"
                  ? "Paste your existing content here..."
                  : "Tell SooSaare what you want to create..."
              }
            />

            <div className="editor-footer">
              <span>
                {topic.length} characters
              </span>

              <span>
                {mode === "ideas"
                  ? "SooSaare will discover opportunities"
                  : mode === "repurpose"
                  ? "Transform existing content"
                  : "SooSaare will handle the creative direction"}
              </span>
            </div>

          </div>

          <div className="settings">

            <div className="setting">
              <label>Platform</label>

              <select aria-label="Platform"
                value={platform}
                onChange={(e) =>
                  setPlatform(e.target.value)
                }
              >
                {platforms.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting">
              <label>Language</label>

              <select aria-label="Language"
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
              >
                {languages.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting"><label>Content style</label><select value={style} onChange={(e) => setStyle(e.target.value)}>{contentStyles.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="setting"><label>Audience</label><select value={audience} onChange={(e) => setAudience(e.target.value)}>{audiences.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="setting"><label>Content goal</label><select value={goal} onChange={(e) => setGoal(e.target.value)}>{goals.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="setting"><label>Duration</label><select value={duration} onChange={(e) => setDuration(e.target.value)}>{durations.map((item) => <option key={item}>{item}</option>)}</select></div>

            <button
              className="create-button"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-dot"></span>
                  Creating...
                </>
              ) : (
                <>
                  {mode === "ideas" ? "Generate 10 ideas" : mode === "repurpose" ? "Repurpose content" : "Generate Complete Content"}

                  <span>↗</span>
                </>
              )}
            </button>

          </div>

          {error && (
            <div className="error">
              <span>!</span>
              {error}
            </div>
          )}

        </div>
      </section>

      <div className="workspace-note">
        <span>✦</span>
        Built for creators, businesses & ambitious ideas.
      </div>
    </>
  );
}

/* ========================================================
   IDEAS
======================================================== */

function IdeasResults({
  ideas,
  platform,
  language,
  onBack,
  onCopy,
  onCopyAll,
  onUseIdea,
  onSaveIdea,
  onGenerateMore,
  error,
}) {
  return (
    <section className="results-page">

      <div className="results-top">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to editor
        </button>

        <button className="secondary-action" onClick={onGenerateMore}>Generate more ideas</button>

        <button
          className="secondary-action"
          onClick={onCopyAll}
        >
          Copy all
        </button>
      </div>

      {error && <div className="error" role="alert">{error}</div>}
      {content.scenes && <div className="workflow-stages" aria-label="Content workflow stages">{["Idea", "Strategy", "Hook", "Script", "Production", "Publish"].map((stage, index) => <div className={index < 6 ? "complete" : ""} key={stage}><span>{String(index + 1).padStart(2, "0")}</span>{stage}</div>)}</div>}
      <div className="results-intro">
        <span className="hero-label">
          CONTENT IDEAS
        </span>

        <h1>
          Ten ideas.
          <br />
          <em>One great start.</em>
        </h1>

        <div className="result-info">
          <span>{platform}</span>
          <i>•</i>
          <span>{language}</span>
        </div>
      </div>

      <div className="ideas-list">

        {ideas.map((idea, index) => (
          <article
            className="idea-card"
            key={index}
          >
            <div className="idea-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="idea-main">

              <span className="idea-label">
                CONTENT IDEA
              </span>

              <h2>
                {idea.title}
              </h2>

              <p className="idea-angle">
                {idea.angle}
              </p>
              <p className="idea-meta">Audience: {idea.audience || "Your selected audience"} · Format: {idea.format || platform}</p>
              {idea.whyItWorks && <p className="idea-angle">Why it works: {idea.whyItWorks}</p>}

              <div className="idea-hook">
                <span>HOOK</span>

                <p>{idea.hook}</p>
              </div>

              <div className="idea-actions">

                <button
                  className="use-idea"
                  onClick={() =>
                    onUseIdea(idea)
                  }
                >
                  Use this idea
                  <span>→</span>
                </button>

                <button
                  className="copy-link"
                  onClick={() =>
                    onCopy(
                      `${idea.title}\n${idea.angle}\nHook: ${idea.hook}`
                    )
                  }
                >
                  Copy
                </button>

                <button className="copy-link" onClick={() => onSaveIdea(idea)}>Save</button>

              </div>

            </div>
          </article>
        ))}

      </div>
    </section>
  );
}

/* ========================================================
   RESULTS
======================================================== */

function Results({
  content,
  platform,
  language,
  onCopy,
  onCopyAll,
  onBack,
  onRegenerate,
  onSave,
  onEdit,
  loading,
  error,
  onRegenerateField,
}) {
  return (
    <section className="results-page">

      <div className="results-top">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to editor
        </button>

        <div className="result-actions">

          <button
            className={content.scenes ? "create-another-action" : ""}
            aria-label={content.scenes ? "Create another content package" : "Regenerate content package"}
            onClick={content.scenes ? onBack : onRegenerate}
            disabled={loading && !content.scenes}
          >
            ↻ Regenerate
          </button>

          <button onClick={onSave}>
            Save
          </button>

          <button
            className="primary-small"
            onClick={onCopyAll}
          >
            Copy all
          </button>

        </div>

      </div>

      {error && <div className="error" role="alert">{error}</div>}
      <div className="results-intro">

        <span className="hero-label">
          YOUR CONTENT
        </span>

        <h1>
          Ready to
          <br />
          <em>publish.</em>
        </h1>

        <div className="result-info">
          <span>{platform}</span>
          <i>•</i>
          <span>{language}</span>
        </div>

      </div>

      <div className="content-output">

        {content.hook && (
          <OutputBlock
            label="01 / HOOK"
            title="Start strong."
            text={content.hook}
            onCopy={() =>
              onCopy(content.hook)
            }
            onChange={(value) => onEdit("hook", value)}
            onRegenerate={() => onRegenerateField("hook", "hook")}
            actionsBelow
            actionName="Hook"
            variant="hook"
          />
        )}

        {content.script && (
          <OutputBlock
            label="02 / SCRIPT"
            title="The story."
            text={content.script}
            onCopy={() =>
              onCopy(content.script)
            }
            onChange={(value) => onEdit("script", value)}
            onRegenerate={() => onRegenerateField("script", "script")}
            large
            actionsBelow
            actionName="Script"
            variant="script"
          />
        )}

        {content.visuals?.length > 0 && (
          <div className="output-block">

            <div className="output-header">
              <div>
                <span>
                  03 / VISUAL PLAN
                </span>

                <h2>
                  Make it visual.
                </h2>
              </div>
              <button className="copy-link" onClick={() => onRegenerateField("visuals", "visuals")}>Regenerate</button>
            </div>

            <div className="visual-timeline">

              {content.visuals.map(
                (visual, index) => (
                  <div
                    className="timeline-item"
                    key={index}
                  >
                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div>
                      <textarea aria-label={`Edit visual direction ${index + 1}`} value={visual} onChange={(event) => { const visuals = [...content.visuals]; visuals[index] = event.target.value; onEdit("visuals", visuals); }} />
                    </div>
                  </div>
                )
              )}

            </div>
          </div>
        )}

        {content.caption && (
          <OutputBlock
            label="04 / CAPTION"
            title="The caption."
            text={content.caption}
            onCopy={() =>
              onCopy(content.caption)
            }
            onChange={(value) => onEdit("caption", value)}
            onRegenerate={() => onRegenerateField("caption", "caption")}
          />
        )}

        {content.cta && (
          <OutputBlock
            label="05 / CTA"
            title="Keep them moving."
            text={content.cta}
            onCopy={() =>
              onCopy(content.cta)
            }
            onChange={(value) => onEdit("cta", value)}
            onRegenerate={() => onRegenerateField("cta", "cta")}
          />
        )}

        {content.hashtags?.length > 0 && (
          <div className="output-block">

            <div className="output-header">

              <div>
                <span>
                  06 / DISCOVERY
                </span>

                <h2>
                  Find your audience.
                </h2>
              </div>

              <button
                className="copy-link"
                onClick={() =>
                  onCopy(
                    content.hashtags.join(" ")
                  )
                }
              >
                Copy hashtags
              </button>
              <button className="copy-link" onClick={() => onRegenerateField("hashtags", "hashtags")}>Regenerate</button>

            </div>

            <div className="hashtag-list">

              {content.hashtags.map(
                (tag, index) => (
                  <span key={index}>
                    {tag}
                  </span>
                )
              )}

            </div>
            <textarea className="edit-list-field" aria-label="Edit hashtags" value={content.hashtags.join("\n")} onChange={(event) => onEdit("hashtags", event.target.value.split("\n"))} />
          </div>
        )}

        {content.scenes?.length > 0 && <CompletePackage content={content} onEdit={onEdit} onCopy={onCopy} onRegenerate={onRegenerateField} />}

      </div>
    </section>
  );
}

/* ========================================================
   OUTPUT BLOCK
======================================================== */

function OutputBlock({
  label,
  title,
  text,
  onCopy,
  large = false,
  onChange,
  onRegenerate,
  actionsBelow = false,
  actionName = "content",
  variant = "",
}) {
  return (
    <section className={actionsBelow ? `result-content-section ${variant}-result-section` : undefined}>
    <article className={`output-block ${large ? "large" : ""} ${actionsBelow ? `${variant}-result-card` : ""}`}>

      <div className="output-header">

        <div>
          <span>{label}</span>
          <h2>{title}</h2>
        </div>

        {!actionsBelow && <>
          <button
            className="copy-link"
            onClick={onCopy}
          >
            Copy
          </button>
          {onRegenerate && <button className="copy-link" onClick={onRegenerate}>Regenerate</button>}
        </>}

      </div>

      {onChange ? <textarea className="output-edit" aria-label={`Edit ${title}`} value={text} onChange={(event) => onChange(event.target.value)} /> : <div className="output-text">{text}</div>}

    </article>
    {actionsBelow && <div className={`result-section-actions ${variant}-result-actions`}>
      <button className="result-section-action" onClick={onCopy}><span className="action-number">01</span><span>Copy {actionName}</span></button>
      {onRegenerate && <button className="result-section-action" onClick={onRegenerate}><span className="action-number">02</span><span>Regenerate {actionName}</span></button>}
    </div>}
    </section>
  );
}

function CompletePackage({ content, onEdit, onCopy, onRegenerate }) {
  const fields = [["idea", "Content idea"], ["angle", "Content angle"], ["audience", "Target audience"], ["goal", "Content goal", "strategy"], ["strategy", "Content strategy", "strategy"], ["filmingPlan", "Solo filming plan", "filming"], ["visuals", "Visual plan", "visuals"], ["broll", "B-Roll plan", "broll"], ["onScreenText", "On-screen text", "onscreen_text"], ["editingPlan", "Editing plan", "scenes"], ["title", "Title", "title"], ["thumbnail", "Thumbnail concept", "thumbnail"], ["postingRecommendation", "Posting recommendation", "calendar"]];
  return <section className="complete-package"><div className="output-block"><div className="output-header"><div><span>PRODUCTION WORKSPACE</span><h2>Plan, film, edit and publish</h2></div><button className="copy-link" onClick={() => onCopy(JSON.stringify(content, null, 2))}>Copy package</button></div><div className="package-fields">{fields.map(([field, label, action]) => <div className="package-field" key={field}>{label}<textarea aria-label={`Edit ${label}`} value={Array.isArray(content[field]) ? content[field].join("\n") : content[field] || ""} onChange={(event) => onEdit(field, Array.isArray(content[field]) ? event.target.value.split("\n") : event.target.value)} />{action && <button className="copy-link" onClick={() => onRegenerate(field, action)}>Regenerate {label.toLowerCase()}</button>}</div>)}</div></div>
    <div className="output-block"><div className="output-header"><div><span>SCENE & SHOT PLANNER</span><h2>Film this, scene by scene</h2></div></div>{content.scenes.map((scene, index) => <div className="editable-scene" key={index}><h3>Scene {String(scene.sceneNumber || index + 1).padStart(2, "0")} · {scene.duration}</h3><div className="package-fields">{Object.entries(scene).filter(([key]) => key !== "sceneNumber").map(([key, value]) => <label className="package-field" key={key}>{key.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())}<textarea value={value || ""} onChange={(event) => { const scenes = [...content.scenes]; scenes[index] = { ...scenes[index], [key]: event.target.value }; onEdit("scenes", scenes); }} /></label>)}</div></div>)}</div>
  </section>;
}

/* ========================================================
   LIBRARY
======================================================== */

function LibraryPage({
  library,
  search,
  setSearch,
  filter,
  setFilter,
  onOpen,
  onDelete,
  onFavorite,
  onCreate,
}) {
  return (
    <section className="library-page">

      <div className="page-heading">
        <div>
          <span className="hero-label">
            YOUR WORK
          </span>

          <h1>
            Library
          </h1>

          <p>
            Everything you saved in one place.
          </p>
        </div>

        <button
          className={`favorite-filter ${
            filter === "Favorites" ? "active" : ""
          }`}
          onClick={() =>
            setFilter("Favorites")
          }
        >
          ★ Favorites
        </button>
      </div>

      <div className="library-filter-row">
        <button className={`favorite-filter ${filter === "Recent" ? "active" : ""}`} onClick={() => setFilter("Recent")}>Recent</button>
        <button className={`favorite-filter ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>All</button>
      </div>

      <div className="library-search">
        <span>⌕</span>

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search your content..."
        />
      </div>

      {library.length === 0 ? (
        <div className="empty-state">

          <div className="empty-icon">
            □
          </div>

          <h2>
            Your library is empty.
          </h2>

          <p>
            Create something great and save it
            here for later.
          </p>
          <button className="create-button empty-cta" onClick={onCreate}>Create content <span>↗</span></button>

        </div>
      ) : library.length > 0 &&
        !library.some((item) =>
          filter === "Favorites"
            ? item.favorite
            : true
        ) ? (
        <div className="empty-state">
          <div className="empty-icon">
            ★
          </div>

          <h2>
            {filter === "Favorites" ? "No favorites yet." : "No recent content yet."}
          </h2>

          <p>
            Favorite content will appear here.
          </p>
        </div>
      ) : (
        <div className="library-grid">

          {library.map((item) => {

            const date = new Date(
              item.createdAt
            ).toLocaleDateString();

            return (
              <article
                className="library-card"
                key={item.id}
              >

                <div className="library-card-top">

                  <span>
                    {item.platform}
                  </span>

                  <button
                    className={
                      item.favorite
                        ? "star active"
                        : "star"
                    }
                    onClick={() =>
                      onFavorite(item.id)
                    }
                  >
                    ★
                  </button>

                </div>

                <h2>
                  {item.title}
                </h2>

                <p>
                  {item.topic}
                </p>

                <small>
                  {date} · {item.language}
                </small>

                <div className="library-actions">

                  <button
                    onClick={() =>
                      onOpen(item)
                    }
                  >
                    Open
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      onDelete(item.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}

/* ========================================================
   TEMPLATES
======================================================== */

function TemplatesPage({ templates, onUse }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Education",
    "Social Media",
    "Business",
    "Personal Brand",
    "AI & Tech",
    "Marketing",
  ];

  const filteredTemplates = templates.filter((template) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query);

    const matchesCategory =
      category === "All" || template.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="templates-page">
      <div className="templates-header">
        <div>
          <span className="hero-label">START FASTER</span>

          <h1>Choose a template</h1>

          <p>
            Start with a proven content format and turn your idea into
            ready-to-post content.
          </p>
        </div>

        <div className="template-count">
          <strong>{filteredTemplates.length}</strong>
          <span>templates</span>
        </div>
      </div>

      <div className="template-toolbar">
        <div className="template-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="template-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="template-grid">
          {filteredTemplates.map((template) => (
            <article className="template-card" key={template.id}>
              <div className="template-card-top">
                <div className="template-icon">
                  {template.icon}
                </div>

                <span className="template-category">
                  {template.category}
                </span>
              </div>

              <h2>{template.title}</h2>

              <p>{template.description}</p>

              <div className="template-preview">
                <span>AI will create</span>
                <strong>
                  Hook · Script · Visuals · Caption · CTA
                </strong>
              </div>

              <button
                className="template-use-btn"
                onClick={() => onUse(template)}
              >
                Use Template
                <span>→</span>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="template-empty">
          <div>🔎</div>

          <h2>No templates found</h2>

          <p>
            Try another search or choose a different category.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Show all templates
          </button>
        </div>
      )}
    </section>
  );
}

/* ========================================================
   PROFILE
======================================================== */

function ProfilePage({
  libraryCount,
  setActiveNav,
  templateCount,
  platform,
  language,
  style,
  audience,
}) {
  return (
    <section className="profile-page">

      <div className="page-heading">

        <div>
          <span className="hero-label">
            ACCOUNT
          </span>

          <h1>
            Profile
          </h1>

          <p>
            Your SooSaare creator workspace.
          </p>
        </div>

      </div>

      <div className="profile-panel">

        <div className="large-avatar">
          A
        </div>

        <div>
          <h2>
            Asma
          </h2>

          <p>
            Creator
          </p>
        </div>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <span>
            SAVED CONTENT
          </span>

          <strong>
            {libraryCount}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            AI WORKFLOWS
          </span>

          <strong>
            3
          </strong>
        </div>

        <div className="stat-card">
          <span>
            TEMPLATES
          </span>

          <strong>
            {templateCount}
          </strong>
        </div>

      </div>

      <div className="settings-panel">

        <h2>
          Workspace
        </h2>

        <div className="setting-row">
          <div>
            <strong>
              Default language
            </strong>

            <small>
              Used when creating new content
            </small>
          </div>

          <span>
            {language}
          </span>
        </div>

        <div className="setting-row">
          <div>
            <strong>
              Default platform
            </strong>

            <small>
              Your preferred publishing platform
            </small>
          </div>

          <span>
            {platform}
          </span>
        </div>

        <div className="setting-row"><div><strong>Content style</strong><small>Current workspace preference</small></div><span>{style}</span></div>
        <div className="setting-row"><div><strong>Audience</strong><small>Current target audience</small></div><span>{audience}</span></div>

      </div>

      <div className="profile-quick-actions"><button onClick={() => setActiveNav("Create")}>Create content</button><button onClick={() => setActiveNav("Templates")}>Browse templates</button><button onClick={() => setActiveNav("Library")}>Open library</button></div>

      <button
        className="back-create"
        onClick={() =>
          setActiveNav("Create")
        }
      >
        ← Back to Create
      </button>

    </section>
  );
}

export default App;
