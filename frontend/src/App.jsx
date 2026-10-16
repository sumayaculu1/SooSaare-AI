import { useEffect, useMemo, useState } from "react";
import "./App.css";

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
  "Facebook",
  "LinkedIn",
];

const languages = ["Somali", "English", "Arabic"];

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
];

function App() {
  const [activeNav, setActiveNav] = useState("Create");
  const [mode, setMode] = useState("ideas");

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [language, setLanguage] = useState("Somali");

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [library, setLibrary] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("soosaare-library") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const selectedWorkflow = workflows.find(
    (item) => item.id === mode
  );

  useEffect(() => {
    localStorage.setItem(
      "soosaare-library",
      JSON.stringify(library)
    );
  }, [library]);

  // ======================================================
  // GENERATE
  // ======================================================

  const handleGenerate = async () => {
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
    setContent(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            platform,
            language,
            mode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      setContent(data.content);
    } catch (err) {
      console.error(err);

      setError(
        "SooSaare could not connect to the AI. Make sure the backend is running."
      );
    } finally {
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
    } catch (err) {
      console.error(err);
    }
  };

  const copyAll = async () => {
    if (!content) return;

    if (content.ideas) {
      const text = content.ideas
        .map(
          (idea, index) =>
            `${index + 1}. ${idea.title}\n${idea.angle}\nHook: ${idea.hook}`
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
  };

  const deleteContent = (id) => {
    setLibrary((prev) =>
      prev.filter((item) => item.id !== id)
    );
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
    }
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

      const matchesFavorite =
        !favoritesOnly || item.favorite;

      return matchesSearch && matchesFavorite;
    });
  }, [library, search, favoritesOnly]);

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

        <div className="sidebar-bottom">

          <div className="ai-status">
            <span className="status-dot"></span>

            <div>
              <strong>
                {loading ? "Creating..." : "AI ready"}
              </strong>

              <small>
                {loading
                  ? "SooSaare is working"
                  : "Ready to create"}
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
            <span className="breadcrumb">
              Workspace
            </span>

            <span className="slash">/</span>

            <strong>{activeNav}</strong>
          </div>

          <div className="top-actions">
            <button className="top-icon">
              ?
            </button>

            <button
              className="top-icon"
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

          {activeNav === "Create" && !content && (
            <CreatePage
              mode={mode}
              setMode={setMode}
              topic={topic}
              setTopic={setTopic}
              platform={platform}
              setPlatform={setPlatform}
              language={language}
              setLanguage={setLanguage}
              selectedWorkflow={selectedWorkflow}
              loading={loading}
              error={error}
              handleGenerate={handleGenerate}
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
              favoritesOnly={favoritesOnly}
              setFavoritesOnly={setFavoritesOnly}
              onOpen={openLibraryItem}
              onDelete={deleteContent}
              onFavorite={toggleFavorite}
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
            />
          )}

        </div>
      </main>
    </div>
  );
}

/* ========================================================
   CREATE PAGE
======================================================== */

function CreatePage({
  mode,
  setMode,
  topic,
  setTopic,
  platform,
  setPlatform,
  language,
  setLanguage,
  selectedWorkflow,
  loading,
  error,
  handleGenerate,
}) {
  return (
    <>
      <section className="hero">
        <span className="hero-label">
          SOOSAARE AI
        </span>

        <h1>
          Create content
          <br />
          <em>people remember.</em>
        </h1>

        <p>
          Your creative workspace for ideas,
          scripts and content that actually connects
          with your audience.
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

              <h2>
                {selectedWorkflow.title}
              </h2>
            </div>
          </div>

          <div className="editor">

            <textarea
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              placeholder={
                mode === "ideas"
                  ? "Example: AI for Somali students..."
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

              <select
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

              <select
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
                  {mode === "ideas"
                    ? "Find ideas"
                    : "Create content"}

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

        <button
          className="secondary-action"
          onClick={onCopyAll}
        >
          Copy all
        </button>
      </div>

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
  loading,
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
            onClick={onRegenerate}
            disabled={loading}
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
            large
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
                      <p>{visual}</p>
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
          </div>
        )}

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
}) {
  return (
    <article
      className={`output-block ${
        large ? "large" : ""
      }`}
    >

      <div className="output-header">

        <div>
          <span>{label}</span>
          <h2>{title}</h2>
        </div>

        <button
          className="copy-link"
          onClick={onCopy}
        >
          Copy
        </button>

      </div>

      <div className="output-text">
        {text}
      </div>

    </article>
  );
}

/* ========================================================
   LIBRARY
======================================================== */

function LibraryPage({
  library,
  search,
  setSearch,
  favoritesOnly,
  setFavoritesOnly,
  onOpen,
  onDelete,
  onFavorite,
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
            favoritesOnly ? "active" : ""
          }`}
          onClick={() =>
            setFavoritesOnly(!favoritesOnly)
          }
        >
          ★ Favorites
        </button>
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

        </div>
      ) : library.length > 0 &&
        !library.some((item) =>
          favoritesOnly
            ? item.favorite
            : true
        ) ? (
        <div className="empty-state">
          <div className="empty-icon">
            ★
          </div>

          <h2>
            No favorites yet.
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
            6
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
            Somali
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
            TikTok
          </span>
        </div>

      </div>

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
