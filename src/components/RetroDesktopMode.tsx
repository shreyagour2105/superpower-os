import React, { useState } from 'react';
import {
  Terminal,
  User,
  Code2,
  FolderKanban,
  Gamepad2,
  LogOut,
  Minimize2,
  Maximize2,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  PROFILE_INFO,
  PROJECTS,
  SKILL_GROUPS,
  ThemeId,
} from '../data/portfolioData';
import { CyberTerminal } from './CyberTerminal';

interface RetroDesktopModeProps {
  onExitDesktop: () => void;
  onUnlockArcade: () => void;
  onSelectTheme: (theme: ThemeId) => void;
}

type WindowId = 'about' | 'skills' | 'projects' | 'terminal';

interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export const RetroDesktopMode: React.FC<RetroDesktopModeProps> = ({
  onExitDesktop,
  onUnlockArcade,
  onSelectTheme,
}) => {
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'about',
      title: 'About_Shreya.txt — Notepad',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
    },
    {
      id: 'projects',
      title: 'Verified_Projects — Explorer',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 11,
    },
    {
      id: 'skills',
      title: 'Skills_Matrix.sys',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 9,
    },
    {
      id: 'terminal',
      title: 'Cyber_Mission_Control.exe',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
    },
  ]);

  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const focusWindow = (id: WindowId) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) =>
        w.id === id
          ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
          : w
      );
    });
    setStartMenuOpen(false);
  };

  const closeWindow = (id: WindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
  };

  const toggleMinimize = (id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
    );
  };

  const toggleMaximize = (id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const visibleWindows = windows
    .filter((w) => w.isOpen && !w.isMinimized)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      data-testid="retro-desktop-view"
      className="fixed inset-0 z-40 bg-[#008080] text-black flex flex-col justify-between overflow-hidden font-mono-code select-none"
    >
      {/* Top Return Banner for Accessibility & Clarity */}
      <div className="bg-[#000080] text-white px-4 py-2 flex items-center justify-between border-b-2 border-white text-xs">
        <div className="flex items-center gap-2 font-bold">
          <span>SUPERPOWER.OS // RETRO 98 DESKTOP ENVIRONMENT</span>
        </div>
        <button
          type="button"
          onClick={onExitDesktop}
          className="px-3 py-1 bg-[#c0c0c0] text-black font-bold border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] hover:bg-white flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>RETURN TO STANDARD PORTFOLIO</span>
        </button>
      </div>

      {/* Main Desktop Area */}
      <div className="relative flex-1 p-4 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Desktop Icons Column */}
        <div className="lg:col-span-2 flex lg:flex-col flex-wrap gap-3">
          <button
            type="button"
            onClick={() => focusWindow('about')}
            className="flex flex-col items-center gap-1 p-2 text-white hover:bg-[#000080]/60 border border-transparent focus:border-dotted focus:border-white w-24 text-center"
          >
            <User className="w-7 h-7 text-[#ffff00]" />
            <span className="text-xs leading-tight">About Me</span>
          </button>

          <button
            type="button"
            onClick={() => focusWindow('skills')}
            className="flex flex-col items-center gap-1 p-2 text-white hover:bg-[#000080]/60 border border-transparent focus:border-dotted focus:border-white w-24 text-center"
          >
            <Code2 className="w-7 h-7 text-[#00ffff]" />
            <span className="text-xs leading-tight">Skills.sys</span>
          </button>

          <button
            type="button"
            onClick={() => focusWindow('projects')}
            className="flex flex-col items-center gap-1 p-2 text-white hover:bg-[#000080]/60 border border-transparent focus:border-dotted focus:border-white w-24 text-center"
          >
            <FolderKanban className="w-7 h-7 text-[#ffcc00]" />
            <span className="text-xs leading-tight">Projects</span>
          </button>

          <button
            type="button"
            onClick={() => focusWindow('terminal')}
            className="flex flex-col items-center gap-1 p-2 text-white hover:bg-[#000080]/60 border border-transparent focus:border-dotted focus:border-white w-24 text-center"
          >
            <Terminal className="w-7 h-7 text-[#00ff66]" />
            <span className="text-xs leading-tight">Mission Cmd</span>
          </button>

          <button
            type="button"
            onClick={onUnlockArcade}
            className="flex flex-col items-center gap-1 p-2 text-white hover:bg-[#000080]/60 border border-transparent focus:border-dotted focus:border-white w-24 text-center"
          >
            <Gamepad2 className="w-7 h-7 text-[#ff66cc]" />
            <span className="text-xs leading-tight">Arcade.rom</span>
          </button>
        </div>

        {/* Open Windows Workspace */}
        <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
          {visibleWindows.length === 0 && (
            <div className="col-span-2 p-8 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black text-center space-y-3">
              <p className="text-sm font-bold">No desktop windows currently open.</p>
              <p className="text-xs">
                Click any icon on the desktop or open the Start Menu below to launch a module.
              </p>
            </div>
          )}

          {visibleWindows.map((win) => (
            <div
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className={`bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black shadow-md flex flex-col ${
                win.isMaximized || win.id === 'terminal' ? 'md:col-span-2' : ''
              }`}
            >
              {/* Classic 98 Titlebar */}
              <div className="bg-[#000080] text-white px-2.5 py-1.5 flex items-center justify-between text-xs font-bold">
                <span className="truncate">{win.title}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMinimize(win.id);
                    }}
                    aria-label={`Minimize ${win.title}`}
                    className="w-5 h-5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaximize(win.id);
                    }}
                    aria-label={`Maximize ${win.title}`}
                    className="w-5 h-5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeWindow(win.id);
                    }}
                    aria-label={`Close ${win.title}`}
                    className="w-5 h-5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Window Body */}
              <div className="p-4 bg-white text-black text-xs sm:text-sm space-y-3 border-t border-[#808080] max-h-96 overflow-y-auto select-text">
                {win.id === 'about' && (
                  <div className="space-y-2">
                    <div className="font-bold text-base">{PROFILE_INFO.name}</div>
                    <div className="text-xs text-[#333333]">
                      {PROFILE_INFO.role} · {PROFILE_INFO.institution}
                    </div>
                    <p className="leading-relaxed">
                      First-year Information Science and Engineering student at UVCE Bengaluru,
                      exploring cybersecurity, AI safety, cloud computing, and emerging technology.
                    </p>
                    <div className="p-2.5 bg-[#efefef] border border-[#808080]">
                      <strong>Personal Mission:</strong> &ldquo;{PROFILE_INFO.missionStatement}&rdquo;
                    </div>
                  </div>
                )}

                {win.id === 'skills' && (
                  <div className="space-y-3">
                    {SKILL_GROUPS.map((group) => (
                      <div key={group.id} className="space-y-1">
                        <div className="font-bold text-xs uppercase bg-[#000080] text-white px-2 py-0.5">
                          {group.title}
                        </div>
                        <ul className="pl-3 space-y-1">
                          {group.items.map((item) => (
                            <li key={item.name}>
                              <strong>{item.name}</strong> ({item.level}) — {item.detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {win.id === 'projects' && (
                  <div className="space-y-4">
                    {PROJECTS.map((proj) => (
                      <div key={proj.id} className="p-3 border border-[#808080] bg-[#f8f8f8] space-y-1.5">
                        <div className="font-bold text-sm">
                          {proj.code}: {proj.title}
                        </div>
                        <div className="text-xs text-[#444444]">{proj.category}</div>
                        <p className="text-xs leading-relaxed">{proj.whatIBuilt}</p>
                        <div className="flex gap-3 pt-1">
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#000080] underline font-bold text-xs flex items-center gap-1"
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#000080] underline font-bold text-xs flex items-center gap-1"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {win.id === 'terminal' && (
                  <div className="-m-4">
                    <CyberTerminal
                      onNavigateSection={(sec) => {
                        if (sec === 'about' || sec === 'skills' || sec === 'projects') {
                          focusWindow(sec);
                        }
                      }}
                      onOpenThemeModal={() => {}}
                      onSelectTheme={onSelectTheme}
                      onUnlockArcade={onUnlockArcade}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classic Start Menu Popup */}
      {startMenuOpen && (
        <div className="fixed bottom-11 left-2 z-50 w-64 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black shadow-xl">
          <div className="bg-[#000080] text-white px-3 py-1.5 font-bold text-xs">
            SUPERPOWER.OS // START
          </div>
          <div className="p-1.5 space-y-1 text-xs">
            <button
              type="button"
              onClick={() => focusWindow('about')}
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>About Shreya</span>
            </button>
            <button
              type="button"
              onClick={() => focusWindow('skills')}
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Skills Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => focusWindow('projects')}
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects Directory</span>
            </button>
            <button
              type="button"
              onClick={() => focusWindow('terminal')}
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Cyber Mission Control</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStartMenuOpen(false);
                onUnlockArcade();
              }}
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Secret Arcade Mode</span>
            </button>
            <div className="border-t border-[#808080] my-1" />
            <button
              type="button"
              onClick={onExitDesktop}
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white font-bold flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit to Standard Portfolio</span>
            </button>
          </div>
        </div>
      )}

      {/* Classic 98 Taskbar */}
      <div className="h-10 bg-[#c0c0c0] border-t-2 border-white px-2 flex items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black font-bold text-xs flex items-center gap-1.5 shrink-0"
          >
            <span>▣ START</span>
          </button>

          {windows
            .filter((w) => w.isOpen)
            .map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() =>
                  w.isMinimized ? focusWindow(w.id) : toggleMinimize(w.id)
                }
                className={`px-2.5 py-1 text-xs border-2 truncate max-w-[160px] ${
                  !w.isMinimized
                    ? 'bg-[#dfdfdf] border-t-black border-l-black border-r-white border-b-white font-bold'
                    : 'bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black'
                }`}
              >
                {w.title}
              </button>
            ))}
        </div>

        <div className="px-2.5 py-1 border border-[#808080] bg-[#dfdfdf] text-xs shrink-0">
          SHREYA // UVCE
        </div>
      </div>
    </div>
  );
};
