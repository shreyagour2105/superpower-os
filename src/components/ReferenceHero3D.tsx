import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Terminal,
  ExternalLink,
  GitBranch,
  Shield,
  FileText,
  Bot,
  CloudSun,
  BookOpen,
} from 'lucide-react';
import { PROFILE_INFO, PROJECTS, ProjectId, ProjectInfo } from '../data/portfolioData';

interface ReferenceHero3DProps {
  selectedProjectId: ProjectId;
  onSelectProject: (projectId: ProjectId) => void;
  onEnterSystem: () => void;
  onOpenTerminal: () => void;
  onScrollToProjects: () => void;
}

interface Gsaptween {
  to: (target: unknown, vars: Record<string, unknown>) => Gsaptween;
}

export const ReferenceHero3D: React.FC<ReferenceHero3DProps> = ({
  selectedProjectId,
  onSelectProject,
  onEnterSystem,
  onOpenTerminal,
  onScrollToProjects,
}) => {
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const activeProject: ProjectInfo =
    PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  const handleTriggerProjectSwitch = useCallback(
    (nextId: ProjectId) => {
      if (nextId === selectedProjectId) return;
      setIsTransitioning(true);
      onSelectProject(nextId);

      const targetProj = PROJECTS.find((p) => p.id === nextId) || PROJECTS[0];
      const win = window as unknown as { gsap?: Gsaptween };
      if (win.gsap) {
        win.gsap.to(document.body, {
          '--bg-inner': targetProj.bgGradient.inner,
          '--bg-mid': targetProj.bgGradient.mid,
          '--bg-outer': targetProj.bgGradient.outer,
          duration: 1.1,
          ease: 'power2.inOut',
        });
      }

      window.setTimeout(() => {
        setIsTransitioning(false);
      }, 420);
    },
    [selectedProjectId, onSelectProject]
  );

  const cycleProject = (dir: -1 | 1) => {
    const idx = PROJECTS.findIndex((p) => p.id === selectedProjectId);
    const nextIdx = (idx + dir + PROJECTS.length) % PROJECTS.length;
    handleTriggerProjectSwitch(PROJECTS[nextIdx].id);
  };

  useEffect(() => {
    let rafId = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      setTilt({
        rx: -current.y * 11,
        ry: current.x * 14,
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const renderProjectIcon = (id: ProjectId, className = 'w-5 h-5') => {
    switch (id) {
      case 'bankism':
        return <Shield className={className} />;
      case 'notice-helper':
        return <FileText className={className} />;
      case 'moltbook':
        return <Bot className={className} />;
      case 'skycast':
        return <CloudSun className={className} />;
      case 'alexa-studymate':
        return <BookOpen className={className} />;
    }
  };

  // Subordinate 4 satellites positioned around the central Bankism Firewall anchor
  const satellites: Array<{
    project: ProjectInfo;
    positionClass: string;
    lineCoords: { x1: number; y1: number; x2: number; y2: number };
  }> = [
    {
      project: PROJECTS[1], // Notice Helper AI
      positionClass: 'top-[2%] left-[0%] sm:left-[2%]',
      lineCoords: { x1: 300, y1: 280, x2: 110, y2: 85 },
    },
    {
      project: PROJECTS[2], // Moltbook CyberBuddy
      positionClass: 'top-[2%] right-[0%] sm:right-[2%]',
      lineCoords: { x1: 300, y1: 280, x2: 490, y2: 85 },
    },
    {
      project: PROJECTS[3], // SkyCast Weather App
      positionClass: 'bottom-[1%] left-[0%] sm:left-[2%]',
      lineCoords: { x1: 300, y1: 280, x2: 110, y2: 515 },
    },
    {
      project: PROJECTS[4], // Alexa StudyMate
      positionClass: 'bottom-[1%] right-[0%] sm:right-[2%]',
      lineCoords: { x1: 300, y1: 280, x2: 490, y2: 515 },
    },
  ];

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative min-h-[calc(100vh-1rem)] flex items-center justify-center px-[4%] pt-24 pb-12 overflow-hidden"
    >
      <div className="relative w-full min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
        {/* 1. LEFT REGION: SUPERPOWER.OS Introduction, Oversized Typography & Actions */}
        <div className="lg:col-span-4 relative z-30 flex flex-col justify-between h-full py-2 lg:py-6 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="font-mono-code text-xs uppercase tracking-widest text-[#fbcfe8] font-semibold">
                SUPERPOWER.OS
              </div>
              <div className="font-mono-code text-xs text-[var(--text-secondary)]">
                PERSONAL OPERATING SYSTEM // USER PROFILE: SHREYA
              </div>
            </div>

            <h1 id="hero-headline" className="soda-main-title select-none">
              <span className="sr-only">I BUILD. I BREAK. I SECURE. </span>
              <span aria-hidden="true">
                <span>I Build.</span>
                <br />
                <span className="text-[#fbcfe8]">I Break.</span>
              </span>
            </h1>

            <div className="font-mono-code text-xs sm:text-sm font-bold tracking-widest uppercase text-[#fbcfe8]">
              I BUILD. I BREAK. I SECURE.
            </div>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
              {PROFILE_INFO.heroSubcopy}
            </p>

            {/* Primary Rounded Pill Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onEnterSystem}
                className="soda-primary-btn"
              >
                <span>ENTER SYSTEM</span>
                <span className="soda-plus-icon" aria-hidden="true">
                  +
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenTerminal}
                className="soda-primary-btn"
              >
                <Terminal className="w-4 h-4 text-[#fbcfe8]" />
                <span>OPEN TERMINAL</span>
                <span className="soda-plus-icon text-xs font-mono-code" aria-hidden="true">
                  &gt;_
                </span>
              </button>
            </div>
          </div>

          {/* System Status Badge */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-3.5 os-panel px-4 py-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#fbcfe8]" />
              </div>
              <div className="font-mono-code text-[11px] leading-snug space-y-0.5">
                <div className="text-[var(--text-muted)] tracking-wider">
                  SYSTEM STATUS: <span className="text-[#fbcfe8] font-bold">ONLINE</span> · ACCESS:{' '}
                  <span className="text-white font-bold">EXPLORER</span>
                </div>
                <div className="text-white font-semibold">
                  FOCUS: CYBERSECURITY / AI · ENV: STUDENT BUILDER
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CENTER REGION: Cohesive 3D Project Orbit Installation (Bankism Firewall Primary Anchor + 4 Subordinate Satellites) */}
        <div className="lg:col-span-4 relative z-20 flex items-center justify-center min-h-[440px] sm:min-h-[540px]">
          <div
            ref={stageRef}
            data-testid="project-orbit-installation"
            style={{
              transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: 'transform 0.12s ease-out',
            }}
            className="relative w-full max-w-[520px] aspect-square flex items-center justify-center"
          >
            {/* Ambient Radial Halo & Orbital Rings SVG */}
            <svg
              viewBox="0 0 600 600"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="anchorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={activeProject.accentColor} stopOpacity="0.28" />
                  <stop offset="55%" stopColor="#5eead4" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="shieldFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.92" />
                  <stop offset="50%" stopColor="#0f172a" stopOpacity="0.96" />
                  <stop offset="100%" stopColor="#311042" stopOpacity="0.92" />
                </linearGradient>
              </defs>

              {/* Soft Radial Aura */}
              <circle cx="300" cy="300" r="260" fill="url(#anchorGlow)" />

              {/* Outer & Inner Protected Network Orbit Rings */}
              <circle
                cx="300"
                cy="300"
                r="225"
                fill="none"
                stroke="rgba(255, 255, 255, 0.14)"
                strokeWidth="1.2"
                strokeDasharray="6 8"
              />
              <circle
                cx="300"
                cy="300"
                r="162"
                fill="none"
                stroke="rgba(251, 207, 232, 0.25)"
                strokeWidth="1.5"
              />

              {/* Connection Relays from Central Bankism Anchor to the 4 Subordinate Nodes */}
              {satellites.map((sat) => {
                const isSelected = selectedProjectId === sat.project.id;
                return (
                  <g key={sat.project.id}>
                    <line
                      x1={sat.lineCoords.x1}
                      y1={sat.lineCoords.y1}
                      x2={sat.lineCoords.x2}
                      y2={sat.lineCoords.y2}
                      stroke={isSelected ? '#fbcfe8' : 'rgba(255, 255, 255, 0.16)'}
                      strokeWidth={isSelected ? '2.5' : '1.2'}
                      strokeDasharray={isSelected ? 'none' : '4 6'}
                    />
                    <circle
                      cx={(sat.lineCoords.x1 + sat.lineCoords.x2) / 2}
                      cy={(sat.lineCoords.y1 + sat.lineCoords.y2) / 2}
                      r={isSelected ? '4.5' : '2.5'}
                      fill={isSelected ? '#fbcfe8' : '#5eead4'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* PRIMARY CENTRAL VISUAL ANCHOR: Bankism Firewall 3D Security Shield & Transaction Core */}
            <button
              type="button"
              onClick={() => handleTriggerProjectSwitch('bankism')}
              aria-label="Select primary anchor project: Bankism Firewall"
              className={`relative z-30 group cursor-pointer focus:outline-none transition-all duration-500 ${
                isTransitioning ? 'scale-95 opacity-85' : 'scale-100 opacity-100'
              }`}
            >
              <div
                className={`relative w-44 h-52 sm:w-52 sm:h-60 -mt-4 flex flex-col items-center justify-center transition-transform duration-500 ${
                  selectedProjectId === 'bankism' ? 'scale-105' : 'scale-95 hover:scale-100'
                }`}
              >
                {/* 3D Layered Security Shield SVG Sculpture */}
                <svg
                  viewBox="0 0 260 300"
                  className="w-full h-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.65)]"
                  aria-hidden="true"
                >
                  {/* Outer Shield Bevel */}
                  <path
                    d="M130 14 L236 56 V142 C236 212 188 264 130 288 C72 264 24 212 24 142 V56 L130 14 Z"
                    fill="url(#shieldFacet)"
                    stroke={selectedProjectId === 'bankism' ? '#fbcfe8' : 'rgba(255,255,255,0.35)'}
                    strokeWidth={selectedProjectId === 'bankism' ? '3' : '1.8'}
                  />

                  {/* Inner Dimensional Shield Facet */}
                  <path
                    d="M130 32 L218 68 V140 C218 198 178 244 130 266 C82 244 42 198 42 140 V68 L130 32 Z"
                    fill="rgba(9, 20, 40, 0.82)"
                    stroke="rgba(94, 234, 212, 0.45)"
                    strokeWidth="1.5"
                  />

                  {/* Protected Transaction Network Grid Lines inside Shield */}
                  <path
                    d="M130 32 V266 M42 140 H218 M72 85 L188 195 M188 85 L72 195"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />

                  {/* Blocked Threat Pulse Ring */}
                  <circle
                    cx="130"
                    cy="142"
                    r="54"
                    fill="rgba(251, 207, 232, 0.07)"
                    stroke={activeProject.accentColor}
                    strokeWidth="2"
                  />
                  <circle
                    cx="130"
                    cy="142"
                    r="38"
                    fill="rgba(15, 23, 42, 0.95)"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Transaction Nodes on Shield Perimeter */}
                  <circle cx="130" cy="56" r="5" fill="#5eead4" />
                  <circle cx="76" cy="140" r="5" fill="#fbcfe8" />
                  <circle cx="184" cy="140" r="5" fill="#fbcfe8" />
                  <circle cx="130" cy="224" r="5" fill="#5eead4" />

                  {/* Dynamic Central Core Symbol (Reflects Active Project while keeping Bankism Shield Anchor) */}
                  {selectedProjectId === 'bankism' && (
                    <g stroke="#fbcfe8" strokeWidth="2.5" fill="none" strokeLinecap="round">
                      <path d="M130 120 L148 128 V144 C148 155 140 163 130 167 C120 163 112 155 112 144 V128 L130 120 Z" />
                      <path d="M123 143 L128 148 L138 137" stroke="#5eead4" />
                    </g>
                  )}
                  {selectedProjectId === 'notice-helper' && (
                    <g stroke="#5eead4" strokeWidth="2.2" fill="none" strokeLinecap="round">
                      <rect x="114" y="122" width="32" height="40" rx="4" />
                      <line x1="120" y1="132" x2="140" y2="132" stroke="#fbcfe8" />
                      <line x1="120" y1="141" x2="140" y2="141" />
                      <line x1="120" y1="150" x2="133" y2="150" />
                    </g>
                  )}
                  {selectedProjectId === 'moltbook' && (
                    <g stroke="#c084fc" strokeWidth="2.2" fill="none" strokeLinecap="round">
                      <rect x="114" y="126" width="32" height="28" rx="6" />
                      <circle cx="124" cy="140" r="2.5" fill="#fbcfe8" />
                      <circle cx="136" cy="140" r="2.5" fill="#fbcfe8" />
                      <line x1="130" y1="118" x2="130" y2="126" />
                    </g>
                  )}
                  {selectedProjectId === 'skycast' && (
                    <g stroke="#7dd3fc" strokeWidth="2.2" fill="none" strokeLinecap="round">
                      <circle cx="126" cy="138" r="10" stroke="#fbcfe8" />
                      <path d="M122 152 H144 C148 152 150 148 148 144 C146 140 140 140 138 142" />
                    </g>
                  )}
                  {selectedProjectId === 'alexa-studymate' && (
                    <g stroke="#fda4af" strokeWidth="2.2" fill="none" strokeLinecap="round">
                      <path d="M114 128 H128 V156 H114 Z M132 128 H146 V156 H132 Z" />
                      <path d="M120 163 L130 159 L140 163" stroke="#5eead4" />
                    </g>
                  )}
                </svg>

                {/* Central Anchor Badge */}
                <div className="mt-1 px-3 py-1 rounded-full bg-[#060f20]/90 border border-[#fbcfe8]/50 backdrop-blur-md text-center shadow-lg">
                  <div className="font-mono-code text-[9.5px] uppercase tracking-wider text-[#fbcfe8] font-bold whitespace-nowrap">
                    {activeProject.code} · {activeProject.shortTitle}
                  </div>
                  <div className="font-mono-code text-[8.5px] text-white/75 whitespace-nowrap">
                    {activeProject.isPrimaryAnchor
                      ? 'PRIMARY ANCHOR · FAIL-CLOSED'
                      : `ACTIVE NODE · ${activeProject.language.toUpperCase()}`}
                  </div>
                </div>
              </div>
            </button>

            {/* 4 SUBORDINATE ORBITAL PROJECT NODES */}
            {satellites.map(({ project, positionClass }) => {
              const isSelected = selectedProjectId === project.id;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleTriggerProjectSwitch(project.id)}
                  aria-label={`Select project node: ${project.title}`}
                  className={`absolute ${positionClass} z-30 group cursor-pointer focus:outline-none transition-all duration-300 ${
                    isSelected
                      ? 'scale-110 ring-2 ring-[#fbcfe8]'
                      : 'opacity-85 hover:opacity-100 hover:scale-105'
                  } rounded-2xl bg-[#071326]/85 border ${
                    isSelected ? 'border-[#fbcfe8]' : 'border-white/20'
                  } backdrop-blur-md px-3 py-2.5 flex items-center gap-2.5 shadow-lg`}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/20"
                    style={{
                      backgroundColor: isSelected
                        ? '#fbcfe8'
                        : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#011d17' : project.accentColor,
                    }}
                  >
                    {renderProjectIcon(project.id, 'w-4 h-4')}
                  </div>
                  <div className="text-left pr-1">
                    <div className="font-nav text-xs font-bold text-white leading-tight whitespace-nowrap">
                      {project.shortTitle}
                    </div>
                    <div className="font-mono-code text-[9px] text-white/65 whitespace-nowrap">
                      {project.language}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. RIGHT REGION: Compact Project Capsule Selector + Active Project Telemetry + "I Secure Systems" */}
        <div className="lg:col-span-4 relative z-30 flex flex-col justify-between items-start lg:items-end text-left lg:text-right h-full py-2 lg:py-6 gap-6">
          <div className="w-full max-w-md flex flex-col items-start lg:items-end gap-3.5">
            {/* Capsule Selector Pill Bar for All 5 Verified Repositories */}
            <div className="w-full os-panel p-4 sm:p-5 rounded-[28px] text-left space-y-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-2.5">
                <span className="font-mono-code text-[10px] uppercase tracking-widest text-[#fbcfe8] font-bold">
                  PROJECT ORBIT SELECTOR ({PROJECTS.findIndex((p) => p.id === selectedProjectId) + 1}/5)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => cycleProject(-1)}
                    aria-label="Select previous project"
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#fbcfe8] hover:text-[#011d17] border border-white/20 text-white text-xs flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => cycleProject(1)}
                    aria-label="Select next project"
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#fbcfe8] hover:text-[#011d17] border border-white/20 text-white text-xs flex items-center justify-center transition-colors cursor-pointer"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* 5 Compact Capsule Buttons */}
              <div
                role="tablist"
                aria-label="Verified GitHub projects"
                className="grid grid-cols-5 gap-1.5"
              >
                {PROJECTS.map((proj) => {
                  const isActive = proj.id === selectedProjectId;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTriggerProjectSwitch(proj.id)}
                      className={`py-2 px-1.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isActive
                          ? 'border-[#fbcfe8] bg-[#fbcfe8]/20 text-white font-bold shadow-sm'
                          : 'border-white/15 bg-black/25 text-white/70 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      <span
                        className={isActive ? 'text-[#fbcfe8]' : 'text-white/75'}
                      >
                        {renderProjectIcon(proj.id, 'w-4 h-4')}
                      </span>
                      <span className="font-nav text-[9.5px] leading-tight whitespace-nowrap">
                        {proj.shortTitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Project Verified Info Card */}
              <div className="pt-1 space-y-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    data-testid="hero-active-project-title"
                    className="text-lg sm:text-xl font-bold text-white"
                  >
                    {activeProject.title}
                  </h3>
                  <span className="font-mono-code text-[11px] text-[#fbcfe8] shrink-0">
                    {activeProject.language}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {activeProject.whatIBuilt}
                </p>

                <div className="font-mono-code text-[11px] text-white/70">
                  {activeProject.technologies.join(' · ')}
                </div>

                {/* Verified Repository & Live Demo Links */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/15">
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${activeProject.title} GitHub repository`}
                    className="px-3.5 py-1.5 rounded-full bg-[#fbcfe8] text-[#011d17] font-nav text-xs font-bold flex items-center gap-1.5 no-underline hover:opacity-90 transition-opacity"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>GitHub Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${activeProject.title} verified live demo`}
                      className="px-3.5 py-1.5 rounded-full bg-black/55 hover:bg-black/80 border border-white/25 text-white font-nav text-xs font-semibold flex items-center gap-1.5 no-underline transition-colors"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3 text-[#fbcfe8]" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={onScrollToProjects}
                    className="ml-auto text-[11px] font-mono-code text-[#fbcfe8] hover:underline cursor-pointer"
                  >
                    All 5 Projects ↓
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Oversized Right-Side Heading ("I Secure Systems") */}
          <h2 className="soda-side-title select-none" aria-hidden="true">
            <span>I Secure</span>
            <br />
            <span className="text-[#fbcfe8]">Systems</span>
          </h2>
        </div>
      </div>
    </section>
  );
};
