import React, { useEffect, useRef, useState } from 'react';
import { Terminal, CornerDownLeft, Sparkles, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { AVAILABLE_COMMANDS, executeTerminalCommand } from '../utils/terminalEngine';
import { ProjectId, ThemeId } from '../data/portfolioData';

export interface LogEntry {
  id: string;
  command?: string;
  lines: string[];
  isError?: boolean;
  timestamp: string;
}

interface CyberTerminalProps {
  onNavigateSection: (sectionId: string) => void;
  onSelectProject?: (projectId: ProjectId) => void;
  onOpenThemeModal: () => void;
  onSelectTheme: (theme: ThemeId) => void;
  onUnlockArcade: () => void;
  isModalOpen?: boolean;
  onToggleModal?: (open: boolean) => void;
  externalFocusTrigger?: number;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'boot-1',
    lines: [
      'SUPERPOWER.OS KERNEL v2.6 // BUILD: AWS-STUDENT-BUILDER-2026',
      'Session initialized for guest@explorer -> shreya@superpower',
      'Type "help" and press Enter, or select a quick command below to inspect all 5 verified repositories.',
    ],
    timestamp: '00:00:01',
  },
];

const QUICK_HINT_COMMANDS = [
  'help',
  'whoami',
  'about',
  'skills',
  'projects',
  'project bankism',
  'project notice',
  'project moltbook',
  'project skycast',
  'project alexa',
  'achievements',
  'mission',
  'contact',
  'theme',
  'sudo unlock',
  'clear',
];

export const CyberTerminal: React.FC<CyberTerminalProps> = ({
  onNavigateSection,
  onSelectProject,
  onOpenThemeModal,
  onSelectTheme,
  onUnlockArcade,
  isModalOpen = false,
  onToggleModal,
  externalFocusTrigger = 0,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalFocusTrigger > 0) {
      inputRef.current?.focus();
    }
  }, [externalFocusTrigger]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const formatTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const runCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);

    const res = executeTerminalCommand(trimmed);

    if (res.action?.type === 'CLEAR') {
      setLogs([]);
      setInputVal('');
      return;
    }

    const newEntry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      command: trimmed,
      lines: res.lines,
      isError: res.isError,
      timestamp: formatTime(),
    };

    setLogs((prev) => [...prev, newEntry]);
    setInputVal('');

    if (res.action) {
      switch (res.action.type) {
        case 'NAVIGATE_SECTION':
          onNavigateSection(res.action.sectionId);
          break;
        case 'SELECT_PROJECT':
          onSelectProject?.(res.action.projectId);
          break;
        case 'OPEN_THEME_SELECTOR':
          onOpenThemeModal();
          break;
        case 'SET_THEME':
          onSelectTheme(res.action.themeId);
          break;
        case 'UNLOCK_ARCADE':
          setTimeout(() => {
            onUnlockArcade();
          }, 250);
          break;
        case 'EXIT':
          if (onToggleModal && isModalOpen) {
            onToggleModal(false);
          } else {
            onNavigateSection('about');
          }
          break;
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(inputVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const lower = inputVal.trim().toLowerCase();
      if (!lower) return;
      const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(lower));
      if (match) {
        setInputVal(match);
      }
    } else if (e.key === 'Escape' && isModalOpen && onToggleModal) {
      onToggleModal(false);
    }
  };

  return (
    <div
      className="os-panel border border-[var(--border-strong)] bg-[var(--bg-terminal)] text-[var(--text-primary)] overflow-hidden"
      style={{ boxShadow: 'var(--shadow-panel)' }}
    >
      {/* Terminal Window Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 inline-block bg-[var(--accent-danger)]" />
            <span className="w-2.5 h-2.5 inline-block bg-[var(--accent-warn)]" />
            <span className="w-2.5 h-2.5 inline-block bg-[var(--accent-primary)]" />
          </div>
          <div className="flex items-center gap-2 font-mono-code text-xs tracking-wider uppercase text-[var(--text-primary)]">
            <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>CYBER MISSION CONTROL // INTERACTIVE SHELL</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLogs([])}
            aria-label="Clear terminal log"
            className="px-2.5 py-1 text-xs font-mono-code text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>CLEAR</span>
          </button>
          {onToggleModal && (
            <button
              type="button"
              onClick={() => onToggleModal(!isModalOpen)}
              aria-label={isModalOpen ? 'Minimize terminal' : 'Expand terminal'}
              className="px-2.5 py-1 text-xs font-mono-code text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors flex items-center gap-1"
            >
              {isModalOpen ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>DOCK</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" />
                  <span>FOCUS</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* First-Time Visitor Quick Command Bar */}
      <div className="px-4 py-2.5 border-b border-[var(--border-color)] bg-[var(--bg-elevated)]/60 flex flex-wrap items-center gap-1.5">
        <span className="font-mono-code text-[11px] uppercase tracking-wider text-[var(--text-muted)] mr-1">
          QUICK EXEC:
        </span>
        {QUICK_HINT_COMMANDS.map((cmd) => {
          const isSecret = cmd === 'sudo unlock';
          return (
            <button
              key={cmd}
              type="button"
              onClick={() => runCommand(cmd)}
              className={`px-2 py-1 text-xs font-mono-code transition-colors border ${
                isSecret
                  ? 'border-[var(--accent-tertiary)] text-[var(--accent-tertiary)] hover:bg-[var(--accent-tertiary)] hover:text-black font-semibold'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
              }`}
            >
              {isSecret && <Sparkles className="w-3 h-3 inline mr-1" />}
              {cmd}
            </button>
          );
        })}
      </div>

      {/* Terminal Output Log */}
      <div
        ref={logContainerRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output log"
        onClick={() => inputRef.current?.focus()}
        className="p-4 sm:p-5 h-80 sm:h-96 overflow-y-auto font-mono-code text-xs sm:text-sm space-y-4 bg-[var(--bg-terminal)] text-[#e5efe9]"
      >
        {logs.length === 0 ? (
          <div className="text-[var(--text-muted)] italic">
            Terminal output cleared. Type &quot;help&quot; or click any command button above.
          </div>
        ) : (
          logs.map((entry) => (
            <div key={entry.id} className="space-y-1.5">
              {entry.command && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#00f57a] font-semibold select-none">
                    shreya@superpower:~$
                  </span>
                  <span className="text-white font-medium">{entry.command}</span>
                  <span className="text-[11px] text-[#6c7d87] ml-auto select-none">
                    {entry.timestamp}
                  </span>
                </div>
              )}
              <div
                className={`pl-0 sm:pl-3 border-l-2 ${
                  entry.isError
                    ? 'border-[#f43f5e] text-[#fda4af]'
                    : 'border-[#00f57a]/40 text-[#d1fae5]'
                } space-y-1 whitespace-pre-wrap break-words leading-relaxed`}
              >
                {entry.lines.map((line, i) => (
                  <div key={i}>{line || '\u00A0'}</div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Terminal Input Form */}
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border-strong)] bg-[#06090b]"
      >
        <label
          htmlFor="cyber-terminal-input"
          className="font-mono-code text-xs sm:text-sm font-semibold text-[#00f57a] shrink-0 select-none"
        >
          shreya@superpower:~$
        </label>
        <input
          id="cyber-terminal-input"
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. help, skills, project bankism, sudo unlock)..."
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Cyber Mission Control terminal command input"
          className="w-full bg-transparent text-white font-mono-code text-xs sm:text-sm focus:outline-none placeholder:text-[#556973]"
        />
        <button
          type="submit"
          aria-label="Execute terminal command"
          className="px-3 py-1.5 bg-[var(--accent-primary)] text-black font-mono-code text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
        >
          <span>RUN</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
