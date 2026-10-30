/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Palette,
  Gamepad2,
  Monitor,
  ExternalLink,
  Shield,
  Award,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ACHIEVEMENTS,
  PROFILE_INFO,
  ProjectId,
  SKILL_GROUPS,
  THEMES,
  ThemeId,
} from './data/portfolioData';
import { CyberTerminal } from './components/CyberTerminal';
import { ProjectsSection } from './components/ProjectsSection';
import { InteractiveLabSection } from './components/InteractiveLabSection';
import { SecretArcadeModal } from './components/SecretArcadeModal';
import { RetroDesktopMode } from './components/RetroDesktopMode';
import { ReferenceHero3D } from './components/ReferenceHero3D';

const STORAGE_THEME_KEY = 'superpower_os_theme_v1';

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_THEME_KEY) as ThemeId | null;
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'cybercore';
  });

  const [activeNav, setActiveNav] = useState<string>('top');
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId>('bankism');
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [retroDesktopOpen, setRetroDesktopOpen] = useState(false);
  const [terminalModalOpen, setTerminalModalOpen] = useState(false);
  const [terminalFocusCount, setTerminalFocusCount] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  const handleSelectTheme = (nextTheme: ThemeId) => {
    setTheme(nextTheme);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveNav(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenTerminal = () => {
    scrollToSection('mission-control');
    setTerminalFocusCount((c) => c + 1);
  };

  const handleInspectProject = (projectId: ProjectId) => {
    setSelectedProjectId(projectId);
    scrollToSection('projects');
    setTimeout(() => {
      const cardEl = document.getElementById(`project-card-${projectId}`);
      cardEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  };

  return (
    <div
      id="top"
      className="min-h-screen relative text-[var(--text-primary)] selection:bg-[#fbcfe8] selection:text-[#050b18]"
    >
      {/* 1. Reference Glass Header */}
      <header className="fixed top-0 left-0 w-full z-40 px-[4%] py-4 flex items-center justify-between gap-3">
        {/* Reference Logo Lockup (Circle-Plus SVG + Galada Cursive Brand) */}
        <a
          href="#top"
          onClick={() => setActiveNav('top')}
          aria-label="SUPERPOWER.OS Home"
          className="flex items-center gap-2.5 text-[var(--text-primary)] no-underline shrink-0"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="#fbcfe8" strokeWidth="2" />
            <path
              d="M12 8V16M8 12H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col">
            <span className="font-heading-cursive text-xl sm:text-2xl leading-none tracking-wide">
              Superpower.OS
            </span>
            <span className="font-mono-code text-[9px] uppercase tracking-widest text-[#fbcfe8]">
              SHREYA · UVCE
            </span>
          </div>
        </a>

        {/* Reference Center Frosted Glass Navigation Pill */}
        <nav
          aria-label="Primary system navigation"
          className="hidden xl:flex items-center gap-1 p-1.5 nav-glass-pill"
        >
          {[
            { id: 'top', label: 'Home' },
            { id: 'mission-control', label: 'Terminal' },
            { id: 'about', label: 'About' },
            { id: 'skills', label: 'Skills' },
            { id: 'projects', label: 'Projects' },
            { id: 'interactive-lab', label: 'System Lab' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveNav(item.id)}
              className={`nav-pill-item ${activeNav === item.id ? 'active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Reference Right Pill Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setThemePanelOpen(!themePanelOpen)}
            aria-expanded={themePanelOpen}
            aria-label="Toggle theme switcher panel"
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/50 hover:bg-black/75 border border-white/15 text-white font-nav text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
          >
            <Palette className="w-3.5 h-3.5 text-[#fbcfe8]" />
            <span className="hidden md:inline">Theme:</span>
            <span className="hidden sm:inline text-[#fbcfe8] font-bold">
              {THEMES.find((t) => t.id === theme)?.name}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRetroDesktopOpen(true)}
            aria-label="Launch Retro 98 Desktop Mode"
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/50 hover:bg-black/75 border border-white/15 text-white font-nav text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
          >
            <Monitor className="w-3.5 h-3.5 text-[#5eead4]" />
            <span className="hidden md:inline">Desktop 98</span>
          </button>

          <button
            type="button"
            onClick={() => setArcadeOpen(true)}
            aria-label="Unlock Secret Arcade Mode: Firewall Defender"
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#fbcfe8] text-[#050b18] hover:opacity-90 font-nav text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Arcade</span>
          </button>
        </div>
      </header>

      {/* Collapsible Theme Switcher Drawer (Feature Six) */}
      {themePanelOpen && (
        <div
          data-testid="theme-switcher-panel"
          className="fixed top-20 left-[4%] right-[4%] z-50 os-panel p-5"
        >
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-mono-code text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                SELECT SYSTEM VISUAL PROFILE (PERSISTED LOCALLY):
              </div>
              <div className="flex items-center gap-3">
                {theme !== 'cybercore' && (
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('cybercore')}
                    className="text-xs font-mono-code text-[#fbcfe8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>RESET TO DEFAULT (CYBERCORE)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setThemePanelOpen(false)}
                  aria-label="Close theme switcher panel"
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {THEMES.map((item) => {
                const isActive = item.id === theme;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTheme(item.id)}
                    data-testid={`theme-btn-${item.id}`}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-[#fbcfe8] bg-white/15 ring-1 ring-[#fbcfe8]'
                        : 'border-white/15 bg-black/25 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-code text-xs font-bold text-[var(--text-primary)]">
                        {item.name}
                      </span>
                      <span className="flex items-center gap-1" aria-hidden="true">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-white/30"
                          style={{ backgroundColor: item.swatchBg }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-white/30"
                          style={{ backgroundColor: item.swatchAccent }}
                        />
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 leading-snug">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Full-Viewport Reference 3D Hero Stage */}
      <main className="relative z-10">
        <ReferenceHero3D
          onEnterSystem={() => scrollToSection('about')}
          onOpenTerminal={handleOpenTerminal}
          onInspectProject={handleInspectProject}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />

        {/* Portfolio Sections Framed in Reference Frosted Glass Architecture */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-24">
          {/* SECTION 01: CYBER MISSION CONTROL (Interactive Feature One) */}
          <section id="mission-control" className="scroll-mt-24 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                  01. INTERACTIVE TERMINAL
                </div>
                <h2 className="font-heading-cursive text-4xl sm:text-5xl mt-1 font-normal">
                  Cyber Mission Control
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-mono-code text-[var(--text-secondary)]">
                Type commands or click any quick-exec button to inspect projects, skills, or unlock secrets.
              </p>
            </div>

            <CyberTerminal
              onNavigateSection={scrollToSection}
              onSelectProject={handleInspectProject}
              onOpenThemeModal={() => setThemePanelOpen(true)}
              onSelectTheme={handleSelectTheme}
              onUnlockArcade={() => setArcadeOpen(true)}
              isModalOpen={terminalModalOpen}
              onToggleModal={setTerminalModalOpen}
              externalFocusTrigger={terminalFocusCount}
            />
          </section>

          {/* SECTION 02: ABOUT ME & PERSONAL MISSION */}
          <section id="about" className="scroll-mt-24 space-y-6">
            <div className="border-b border-[var(--border-color)] pb-4">
              <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                02. OPERATOR PROFILE
              </div>
              <h2 className="font-heading-cursive text-4xl sm:text-5xl mt-1 font-normal">
                About Shreya S Gour
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 os-panel p-6 sm:p-8 space-y-4 leading-relaxed text-[var(--text-secondary)]">
                <p className="text-base sm:text-lg text-[var(--text-primary)] font-medium">
                  I am a first-year Information Science and Engineering student at{' '}
                  <strong className="text-[#fbcfe8] font-semibold">
                    UVCE Bengaluru
                  </strong>{' '}
                  (University Visvesvaraya College of Engineering), exploring cybersecurity, AI safety,
                  cloud computing, and emerging technology.
                </p>
                <p className="text-sm sm:text-base">
                  Rather than waiting until graduation to build real software, I learn by creating
                  interactive prototypes, testing how web APIs and AI models behave on edge cases,
                  and asking what happens when assumptions break.
                </p>
                <p className="text-sm sm:text-base">
                  I am at the beginning of my engineering journey—building foundational skills in
                  Python, C/C++, and modern web development while investigating how defensive
                  guardrails can make AI assistants and web systems more trustworthy.
                </p>
              </div>

              <div className="lg:col-span-5 os-panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                    <Shield className="w-4 h-4" />
                    <span>PERSONAL MISSION STATEMENT</span>
                  </div>
                  <blockquote className="text-xl sm:text-2xl font-bold leading-snug text-[var(--text-primary)] border-l-4 border-[#fbcfe8] pl-4">
                    “{PROFILE_INFO.missionStatement}”
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)] space-y-2 font-mono-code text-xs text-[var(--text-secondary)]">
                  <div>CAMPUS: UVCE BENGALURU (ISE · 1ST YEAR)</div>
                  <div>FOCUS: CYBERSECURITY · AI SAFETY · CLOUD</div>
                  <div>BUILD: AWS STUDENT BUILDER CHALLENGE</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 03: SKILLS MATRIX */}
          <section id="skills" className="scroll-mt-24 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                  03. CAPABILITY INVENTORY
                </div>
                <h2 className="font-heading-cursive text-4xl sm:text-5xl mt-1 font-normal">
                  Skills &amp; Learning Trajectory
                </h2>
              </div>
              <p className="font-mono-code text-xs text-[var(--text-muted)]">
                Honest representation of current student level — zero inflated ratings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SKILL_GROUPS.map((group) => (
                <div
                  key={group.id}
                  className="os-panel p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="border-b border-[var(--border-color)] pb-3">
                      <div className="font-mono-code text-xs text-[#fbcfe8]">
                        {group.code}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                        {group.title}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {group.items.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                              {skill.name}
                            </span>
                            <span className="font-mono-code text-[11px] text-[#fbcfe8] shrink-0">
                              {skill.level}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {skill.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-color)] font-mono-code text-[11px] text-[var(--text-muted)]">
                    STATUS: ACTIVE PROGRESSION
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 04: VERIFIED PROJECTS */}
          <section id="projects" className="scroll-mt-24 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                  04. REAL WORK ONLY
                </div>
                <h2 className="font-heading-cursive text-4xl sm:text-5xl mt-1 font-normal">
                  Verified Projects &amp; Live Sandboxes
                </h2>
              </div>
              <p className="font-mono-code text-xs text-[var(--text-muted)]">
                Inspect actual architecture, test live interactive demos, and view GitHub repositories.
              </p>
            </div>

            <ProjectsSection
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
            />
          </section>

          {/* SECTION 05: INTERACTIVE SYSTEM LAB (Vending Machine, Scratch Card, Fortune Cookie) */}
          <section id="interactive-lab" className="scroll-mt-24 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                  05. INTERACTIVE SYSTEM MODULES
                </div>
                <h2 className="font-heading-cursive text-4xl sm:text-5xl mt-1 font-normal">
                  Vending Machine, Scratch Card &amp; Fortune Cookie
                </h2>
              </div>
              <p className="font-mono-code text-xs text-[var(--text-muted)]">
                Playful micro-experiences backed by verified portfolio facts.
              </p>
            </div>

            <InteractiveLabSection />
          </section>

          {/* SECTION 06: ACHIEVEMENTS & LEARNING LOG */}
          <section id="achievements" className="scroll-mt-24 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                  06. VERIFIED MILESTONES
                </div>
                <h2 className="font-heading-cursive text-4xl sm:text-5xl mt-1 font-normal">
                  Achievements &amp; Learning Activities
                </h2>
              </div>
              <p className="font-mono-code text-xs text-[var(--text-muted)]">
                Workshops, technical quizzes, hackathons, and cloud skill badges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ACHIEVEMENTS.map((ach) => (
                <div key={ach.id} className="os-panel p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)]">
                    <span>
                      {ach.code} · {ach.category}
                    </span>
                    <Award className="w-4 h-4 text-[#fbcfe8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    {ach.title}
                  </h3>
                  <div className="font-mono-code text-xs text-[#fbcfe8]">
                    {ach.context}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 07: CONTACT & SECRET ARCADE TRIGGER */}
          <section id="contact" className="scroll-mt-24 space-y-6">
            <div className="border-b border-[var(--border-color)] pb-4">
              <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8]">
                07. EXTERNAL COMMUNICATIONS
              </div>
              <h2 className="font-heading-cursive text-4xl sm:text-5xl mt-1 font-normal">
                Connect &amp; Inspect Source
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 os-panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Verified Public Profiles
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    Explore my code repositories on GitHub or connect with me on LinkedIn.
                    No private phone numbers or personal credentials are exposed on this system.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={PROFILE_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Shreya S Gour on GitHub (opens in new tab)"
                    className="soda-primary-btn no-underline"
                  >
                    <span>GITHUB · @shreyagour2105</span>
                    <span className="soda-plus-icon" aria-hidden="true">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </a>

                  <a
                    href={PROFILE_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Shreya S Gour on LinkedIn (opens in new tab)"
                    className="soda-primary-btn no-underline"
                  >
                    <span>LINKEDIN · SHREYA S GOUR</span>
                    <span className="soda-plus-icon" aria-hidden="true">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </a>
                </div>
              </div>

              {/* Subtle Easter Egg Discovery Panel for Secret Arcade Mode */}
              <div className="lg:col-span-5 os-panel p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CLASSIFIED PARTITION · EASTER EGG</span>
                  </div>
                  <h3 className="text-xl font-bold">
                    Secret Arcade Mode: Firewall Defender
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Run <code className="font-mono-code text-[#fbcfe8]">sudo unlock</code> in the terminal above, or trigger the manual override below to defend the node against simulated cyber threats.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setArcadeOpen(true)}
                    className="soda-primary-btn"
                  >
                    <Gamepad2 className="w-4 h-4 text-[#fbcfe8]" />
                    <span>LAUNCH FIREWALL DEFENDER</span>
                    <span className="soda-plus-icon" aria-hidden="true">
                      +
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/15 bg-black/30 backdrop-blur-md py-8 px-[4%]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-xs text-[var(--text-secondary)]">
          <div>
            SUPERPOWER.OS · SHREYA S GOUR · I BUILD. I BREAK. I SECURE.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>UVCE BENGALURU</span>
            <span>·</span>
            <span>AWS AMPLIFY STATIC READY</span>
          </div>
        </div>
      </footer>

      {/* Expanded Terminal Modal (when user clicks FOCUS in terminal header) */}
      {terminalModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded Cyber Mission Control Terminal"
          className="fixed inset-0 z-50 bg-black/85 p-4 sm:p-8 flex items-center justify-center"
        >
          <div className="w-full max-w-5xl">
            <CyberTerminal
              onNavigateSection={(sec) => {
                setTerminalModalOpen(false);
                scrollToSection(sec);
              }}
              onSelectProject={(projId) => {
                setTerminalModalOpen(false);
                handleInspectProject(projId);
              }}
              onOpenThemeModal={() => {
                setTerminalModalOpen(false);
                setThemePanelOpen(true);
              }}
              onSelectTheme={handleSelectTheme}
              onUnlockArcade={() => {
                setTerminalModalOpen(false);
                setArcadeOpen(true);
              }}
              isModalOpen={true}
              onToggleModal={setTerminalModalOpen}
            />
          </div>
        </div>
      )}

      {/* Secret Arcade Mode Modal (Firewall Defender) */}
      <SecretArcadeModal isOpen={arcadeOpen} onClose={() => setArcadeOpen(false)} />

      {/* Optional Retro 98 Desktop Mode */}
      {retroDesktopOpen && (
        <RetroDesktopMode
          onExitDesktop={() => setRetroDesktopOpen(false)}
          onUnlockArcade={() => setArcadeOpen(true)}
          onSelectTheme={handleSelectTheme}
        />
      )}
    </div>
  );
}
