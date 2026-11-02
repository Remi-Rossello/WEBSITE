import { Suspense, lazy, useEffect, useRef, useState } from "react";
import TabsHeader from "./components/TabsHeader";

const LagrangianPanel = lazy(() => import("./projects/lagrangian/LagrangianPanel"));
const StandardModelExplorerPanel = lazy(() => import("./projects/field-catalog/FieldCatalogPanel"));
const DigitRecognizerPanel = lazy(() => import("./projects/digit-recognizer/DigitRecognizerPanel"));
const DinoSkillPanel = lazy(() => import("./projects/dino/DinoSkillPanel"));
const PublicationPanel = lazy(() => import("./projects/publications/PublicationPanel"));
const ProjectsOverview = lazy(() => import("./tabs/projects/ProjectsOverview"));
const CredentialsTab = lazy(() => import("./tabs/credentials/CredentialsTab"));

const latestNewsItems = [
  {
    id: "home",
    title: "New Home page",
    status: "Available",
    date: "June 1st 2026",
    sortDate: "2026-06-01",
    hint: "You are looking at it",
  },
  {
    id: "visitor-count",
    title: "Live visitor counter",
    status: "Available",
    date: "April 5th 2026",
    sortDate: "2026-04-05",
    hint: "Check the bottom of this page",
  },
  {
    id: "field-catalog",
    title: "Standard Model Explorer",
    status: "In progress",
    date: "March 21st 2026",
    sortDate: "2026-03-21",
  },
  {
    id: "dino-skill",
    title: "Agent Skill: Dino Game",
    status: "Available",
    date: "March 12th 2026",
    sortDate: "2026-03-12",
  },
  {
    id: "backend-test",
    title: "Digit recognizer",
    status: "Available",
    date: "March 12th 2026",
    sortDate: "2026-03-12",
  },
  {
    id: "lagrangian",
    title: "Lagrangian explorer",
    status: "In progress",
    date: "February 17th 2026",
    sortDate: "2026-02-17",
  },
].sort((leftItem, rightItem) => rightItem.sortDate.localeCompare(leftItem.sortDate));

const aboutCvPdf = "/assets/docs/Rossello_CV_Software_v2.pdf";
const aboutCvPdfPreview = `${aboutCvPdf}#view=FitH&zoom=page-width&toolbar=0&navpanes=0`;

/**
 * Root frontend component with tab-based navigation.
 * @returns {JSX.Element} Main application layout.
 */
const VALID_TABS = ["home", "about", "certifications", "projects"];

function parseHash(hash) {
  const path = hash.replace(/^#\/?/, "");
  const [tab, project] = path.split("/");
  return {
    activeTab: VALID_TABS.includes(tab) ? tab : "home",
    activeProject: tab === "projects" && project ? project : null,
  };
}

function buildHash(tab, project) {
  if (tab === "projects" && project) return `#projects/${project}`;
  return `#${tab}`;
}

const BACKEND_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://backend-production-rossello.up.railway.app";

function App() {
  const initialState = parseHash(window.location.hash);
  const [activeTab, setActiveTab] = useState(initialState.activeTab);
  const [activeProject, setActiveProject] = useState(initialState.activeProject);
  const [activeCertification, setActiveCertification] = useState(false);
  const isFirstRender = useRef(true);
  const [visits, setVisits] = useState(null);

  // Sync URL → state on browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const { activeTab: tab, activeProject: project } = parseHash(window.location.hash);
      setActiveTab(tab);
      setActiveProject(project);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync state → URL
  useEffect(() => {
    const newHash = buildHash(activeTab, activeProject);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      window.history.replaceState(null, "", newHash);
    } else if (window.location.hash !== newHash) {
      window.history.pushState(null, "", newHash);
    }
  }, [activeTab, activeProject]);

  // On mount, register a visit using a persistent device ID stored in localStorage.
  useEffect(() => {
    let deviceId = localStorage.getItem('visitor_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('visitor_id', deviceId);
    }
    fetch(`${BACKEND_BASE_URL}/api/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setVisits(data.visits))
      .catch((err) => {
        console.error('Failed to register visit:', err);
        setVisits('?');
      });
  }, []);

  // Contants for the structure of the website
  const tabs = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "certifications", label: "Credentials" },
    { id: "projects", label: "Projects" },
  ];
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || "Home";

  useEffect(() => {
    if (activeTab !== "projects") {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeProject, activeTab]);

  // Ticker animation
  const tickerInnerRef = useRef(null);
  const tickerAnimRef = useRef(null);
  const tickerLastTimeRef = useRef(null);
  const tickerOffsetRef = useRef(0);
  const tickerSpeedRef = useRef(65); // px/sec, positive = scroll left

  useEffect(() => {
    const step = (ts) => {
      if (!tickerLastTimeRef.current) tickerLastTimeRef.current = ts;
      const dt = (ts - tickerLastTimeRef.current) / 1000;
      tickerLastTimeRef.current = ts;
      const inner = tickerInnerRef.current;
      if (inner) {
        const half = inner.scrollWidth / 2;
        if (half > 0) {
          tickerOffsetRef.current = ((tickerOffsetRef.current + tickerSpeedRef.current * dt) % half + half) % half;
          inner.style.transform = `translateX(-${tickerOffsetRef.current}px)`;
        }
      }
      tickerAnimRef.current = requestAnimationFrame(step);
    };
    tickerAnimRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(tickerAnimRef.current);
  }, []);

  const handleTickerMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width; // 0 = far left, 1 = far right
    const MAX_SPEED = 320;
    // pos=0 → fast right (reveal left/older), pos=0.5 → stop, pos=1 → fast left (normal forward)
    tickerSpeedRef.current = (pos - 0.5) * 2 * MAX_SPEED;
  };

  const handleTickerMouseLeave = () => {
    tickerSpeedRef.current = 65;
    tickerLastTimeRef.current = null;
  };

  /**
    * Opens the Projects tab and selects a specific project.
    * @param {string} projectId Project identifier to display.
   * @returns {void}
   */
  const openProjectTab = (projectId) => {
    setActiveProject(projectId);
    setActiveTab("projects");
  };

  return (
    <main className="page-shell">
      <TabsHeader tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <p className="sr-only" role="status" aria-live="polite">Current section: {activeTabLabel}</p>

      <section className={`page-content ${activeTab === "home" ? "hero" : ""}`}>
        {activeTab === "home" && (
          <section id="panel-home" role="tabpanel" aria-labelledby="tab-home">
            <h1 className="about-rainbow-title">Welcome to my website !</h1>

            <div className="home-category-grid">
              <div className="home-category-card">
                <img
                  className="home-category-img"
                  src="/assets/images/projects/field-catalog.jpg"
                  alt="Standard Model field diagram"
                />
                <span className="home-category-overlay">
                  <span className="home-category-label">Physics</span>
                </span>
              </div>
              <div className="home-category-card">
                <img
                  className="home-category-img"
                  src="/assets/images/projects/digit-recognizer.jpg"
                  alt="AI digit recognizer"
                />
                <span className="home-category-overlay">
                  <span className="home-category-label">Computers</span>
                </span>
              </div>
              <div className="home-category-card">
                <img
                  className="home-category-img"
                  src="/assets/images/projects/spintronics.jpg"
                  alt="Spintronics spin diagram"
                />
                <span className="home-category-overlay">
                  <span className="home-category-label">Publications</span>
                </span>
              </div>
            </div>
            <div className="home-category-footer">
              <button className="button button-secondary home-see-projects-btn" type="button" onClick={() => setActiveTab("projects")}>
                See all projects →
              </button>
            </div>
          </section>
        )}

        {activeTab === "about" && (
          <section id="panel-about" role="tabpanel" aria-labelledby="tab-about">
            <h1 className="content-title">About</h1>
            <section className="about-story" aria-label="About introduction">
              <img className="about-profile-pic" src="/assets/images/profile-pic.png" alt="Rémi Rossello profile" />
              <h2 className="about-story-title">Hi.</h2>
              <p className="about-story-text">
                I'm Rémi Rossello, a software engineer with a background in materials science and engineering, and a
                graduate of Mines Nancy in France.
              </p>
              <p className="about-story-text">
                Having developed my full-stack skills through independent learning and hands-on experience, I'm looking
                to pursue my career in software engineering, particularly on projects involving AI, an area in which
                I've gained practical experience.
              </p>

              <h2 className="about-story-title">Experiences</h2>
              <p className="about-story-text">
                Following academic training in maths and physics, in 2024, I received my engineering diploma from the "École des
                Mines" in Nancy, France, with a specialization in materials engineering. 
                In the same year, I worked as an intern for OffWorld in Luxembourg, a space startup from the US
                concentrating on the mining of space resources, specifically Lunar water. There, I made use of both
                materials science and programming skills for ESA-sponsored experiments. 
                Then, I briefly joined the Cosmochemistry and Planetology team at the Petrological and Geochemical
                Research Center (CRPG) in Nancy, France, again as in intern. With my tutor Jessica Flahaut and <abbr title="French national space agency">CNES </abbr> 
                engineer Nicolas Théret, we co-authored a scientific proceeding on the spectral identification of Lunar
                minerals thanks to scripts I had written in IDL. This paper was presented at the European Lunar Symposium 2025 in Munster, Germany.
                Today, I am working for Scale AI as a "math expert", writing and correcting math problems for LLM RLHF training.
              </p>

              <h2 className="about-story-title">The computer science journey</h2>
              <p className="about-story-text">
                During my years at school, I had learned how to code in Python, Caml, R, MATLAB, IDL... But we were
                never taught exactly what the computer is <em>doing</em>. And so towards the end of my formation, I
                sought to understand in detail the mysterious and magical world of computers. 
                The starting point was NandGames, a game allowing one to build a CPU and RAM, level by level, from
                transistors, to Nand gates, and then circuits, RAM, ALU, CPU, and finally binary instructions and
                Assembly scripts running on this home-made computer. 
                Then, I learned more about real Assembly and C, reading the classic "Operating systems in three easy pieces". Putting
                this in practice, I installed Linux and experimented. The next chapter was getting certified in real-world skills, like
                full-stack development, HTML/CSS, JavaScript, TypeScript, React, Node.js, SQL, and even Quantum Computing with the IMB framework.
              </p>

              <h2 className="about-story-title">What's next</h2>
              <p className="about-story-text">
                I am currently looking for a new job in software engineering. If you are a recruiter, feel free to reach out to me on <a href="https://www.linkedin.com/in/r%C3%A9mi-rossello-9bba2521b/" target="_blank" rel="noreferrer">LinkedIn</a> or by email at <a href="mailto:remi.rossello@gmail.com">remi.rossello@gmail.com</a>.
              </p>
            </section>

            <div className="about-pdf-viewer">
              <div className="about-pdf-head">
                <p className="about-pdf-title">Software CV</p>
                <div className="about-pdf-actions">
                  <a className="button button-secondary" href={aboutCvPdf} target="_blank" rel="noreferrer">
                    Open
                  </a>
                  <a className="button button-secondary" href={aboutCvPdf} download>
                    Download
                  </a>
                </div>
              </div>
              <embed className="pdf-frame about-pdf-frame" src={aboutCvPdfPreview} type="application/pdf" />
            </div>
          </section>
        )}

        {activeTab === "projects" && (
          <section id="panel-projects" role="tabpanel" aria-labelledby="tab-projects">
            {!activeProject && (
              <Suspense fallback={<p className="project-loading">Loading projects...</p>}>
                <ProjectsOverview onSelectProject={setActiveProject} />
              </Suspense>
            )}

            {activeProject && (
              <div className="projects-content projects-content-cards">
                <Suspense fallback={<p className="project-loading">Loading project...</p>}>
                  {activeProject === "lagrangian" && <LagrangianPanel onBack={() => setActiveProject(null)} />}

                  {activeProject === "backend-test" && <DigitRecognizerPanel onBack={() => setActiveProject(null)} />}

                  {activeProject === "dino-skill" && <DinoSkillPanel onBack={() => setActiveProject(null)} />}

                  {activeProject === "field-catalog" && (
                    <StandardModelExplorerPanel onBack={() => setActiveProject(null)} />
                  )}

                  {activeProject === "computer-roadmap" && (
                    <>
                      <div className="project-detail-toolbar">
                        <button className="button button-secondary" type="button" onClick={() => setActiveProject(null)}>
                          ← Go back
                        </button>
                      </div>
                      <p className="project-loading">Upcoming</p>
                    </>
                  )}

                  {activeProject === "publication-spintronics" && (
                    <PublicationPanel
                      key="publication-spintronics"
                      publicationId="publication-spintronics"
                      onBack={() => setActiveProject(null)}
                    />
                  )}

                  {activeProject === "publication-spectroscopy" && (
                    <PublicationPanel
                      key="publication-spectroscopy"
                      publicationId="publication-spectroscopy"
                      onBack={() => setActiveProject(null)}
                    />
                  )}

                  {activeProject === "publication-lunar-geology" && (
                    <PublicationPanel
                      key="publication-lunar-geology"
                      publicationId="publication-lunar-geology"
                      onBack={() => setActiveProject(null)}
                    />
                  )}
                </Suspense>
              </div>
            )}
          </section>
        )}

        {activeTab === "certifications" && (
          <Suspense fallback={<p className="project-loading">Loading credentials...</p>}>
            <CredentialsTab onDetailChange={setActiveCertification} />
          </Suspense>
        )}
      </section>
      {activeTab === "home" && (
        <div
          className="news-ticker-wrapper"
          aria-label="Latest news"
        >
          <div className="news-ticker-label" aria-hidden="true">
            <span className="news-ticker-dot" />
            LATEST
          </div>
          <div
            className="news-ticker-track"
            onMouseMove={handleTickerMouseMove}
            onMouseLeave={handleTickerMouseLeave}
          >
            <div className="news-ticker-inner" ref={tickerInnerRef}>
              {[...latestNewsItems, ...latestNewsItems].map((item, i) => (
                <span key={`wrap-${i}`} className="news-ticker-item-wrap">
                  {(i === 0 || i === latestNewsItems.length) && (
                    <span className="news-ticker-separator-block" aria-hidden="true">
                      <span className="news-ticker-sep-arrow">← Oldest</span>
                      <span className="news-ticker-sep-divider" />
                      <span className="news-ticker-sep-arrow">Newest →</span>
                    </span>
                  )}
                  <button
                    className="news-ticker-item"
                    type="button"
                    onClick={item.hint ? undefined : () => openProjectTab(item.id)}
                    style={item.hint ? { cursor: "default" } : undefined}
                    tabIndex={i >= latestNewsItems.length ? -1 : 0}
                    aria-hidden={i >= latestNewsItems.length ? "true" : undefined}
                  >
                    <span className="news-ticker-item-date">{item.date}</span>
                    <span className="news-ticker-separator" aria-hidden="true">·</span>
                    <span className="news-ticker-item-title">{item.title}</span>
                    <span
                      className="news-ticker-item-badge"
                      data-status={item.status === "Available" ? "available" : "progress"}
                    >
                      {item.status}
                    </span>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      {!activeProject && !activeCertification && (
        <footer className="site-footer" aria-live="polite">
          <span className="button button-secondary" aria-label="Unique visitors">
            {visits ?? "…"} unique browsers have visited this website !
          </span>
          <span
            className="visit-counter-info"
            title="Counted from browser UUIDs generated once, then added in both a backend SQL database and in the browser's localStorage"
            aria-label="How visitors are counted"
          >
            i
          </span>
        </footer>
      )}
    </main>
  );
}

export default App;