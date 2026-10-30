import {
  ACHIEVEMENTS,
  PROFILE_INFO,
  PROJECTS,
  ProjectId,
  SKILL_GROUPS,
  THEMES,
  ThemeId,
} from '../data/portfolioData';

export interface TerminalCommandResult {
  command: string;
  lines: string[];
  action?:
    | { type: 'CLEAR' }
    | { type: 'EXIT' }
    | { type: 'OPEN_THEME_SELECTOR' }
    | { type: 'SET_THEME'; themeId: ThemeId }
    | { type: 'UNLOCK_ARCADE' }
    | { type: 'NAVIGATE_SECTION'; sectionId: string }
    | { type: 'SELECT_PROJECT'; projectId: ProjectId };
  isError?: boolean;
}

export const AVAILABLE_COMMANDS = [
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
  'exit',
] as const;

function getLevenshteinDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

export function suggestClosestCommand(input: string): string | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  let bestMatch: string | null = null;
  let bestScore = Infinity;

  for (const cmd of AVAILABLE_COMMANDS) {
    if (cmd.startsWith(normalized) || normalized.startsWith(cmd)) {
      return cmd;
    }
    const dist = getLevenshteinDistance(normalized, cmd);
    if (dist < bestScore && dist <= 4) {
      bestScore = dist;
      bestMatch = cmd;
    }
  }
  return bestMatch;
}

function formatProjectDetails(projectId: ProjectId, cleaned: string): TerminalCommandResult {
  const p = PROJECTS.find((item) => item.id === projectId) || PROJECTS[0];
  const lines = [
    `${p.code} · ${p.title.toUpperCase()} (${p.language})`,
    `CATEGORY:   ${p.category}`,
    `PROBLEM:    ${p.problemStatement}`,
    `BUILT:      ${p.whatIBuilt}`,
    'DESIGN GOALS:',
    ...p.designGoals.map((g) => `  - ${g}`),
    `TECH STACK: ${p.technologies.join(' · ')}`,
    `LEARNED:    ${p.whatILearned}`,
    ...(p.liveUrl ? [`LIVE DEMO:  ${p.liveUrl}`] : []),
    `GITHUB:     ${p.githubUrl}`,
  ];
  return {
    command: cleaned,
    lines,
    action: { type: 'SELECT_PROJECT', projectId: p.id },
  };
}

export function executeTerminalCommand(rawInput: string): TerminalCommandResult {
  const cleaned = rawInput.trim();
  const normalized = cleaned.toLowerCase().replace(/\s+/g, ' ');

  if (!normalized) {
    return {
      command: cleaned,
      lines: [],
    };
  }

  switch (normalized) {
    case 'help':
      return {
        command: cleaned,
        lines: [
          'SUPERPOWER.OS · CYBER MISSION CONTROL COMMAND DIRECTORY',
          '-------------------------------------------------------',
          '  help              List all available system commands',
          '  whoami            Display user identity and tagline',
          '  about             Display Shreya’s background and UVCE profile',
          '  skills            List current programming skills and learning areas',
          '  projects          List all 5 verified GitHub repositories',
          '  project bankism   Inspect PRJ_01: Bankism Firewall (TypeScript)',
          '  project notice    Inspect PRJ_02: Notice Helper AI (JavaScript)',
          '  project moltbook  Inspect PRJ_03: Moltbook CyberBuddy (Python)',
          '  project skycast   Inspect PRJ_04: SkyCast Weather App (HTML/CSS/JS)',
          '  project alexa     Inspect PRJ_05: Alexa StudyMate (JavaScript)',
          '  achievements      View verified workshops, badges, and distinctions',
          '  mission           Display personal learning and security mission',
          '  contact           Reveal GitHub and LinkedIn links',
          '  theme             Open theme selector (or run: theme <name>)',
          '  sudo unlock       [CLASSIFIED] Launch FIREWALL DEFENDER: SYSTEM BREACH',
          '  clear             Clear terminal log output',
          '  exit              Return focus to portfolio / close overlay',
        ],
      };

    case 'whoami':
      return {
        command: cleaned,
        lines: [
          `USER:       ${PROFILE_INFO.name} (${PROFILE_INFO.handle})`,
          `ROLE:       ${PROFILE_INFO.role}`,
          `CAMPUS:     ${PROFILE_INFO.institution}`,
          `HEADLINE:   ${PROFILE_INFO.tagline}`,
          `SUMMARY:    ${PROFILE_INFO.heroSubcopy}`,
        ],
      };

    case 'about':
      return {
        command: cleaned,
        lines: [
          'ABOUT · SHREYA S GOUR',
          '---------------------',
          'First-year Information Science and Engineering student at UVCE Bengaluru.',
          'Curious about cybersecurity, AI safety, cloud computing, and emerging systems.',
          'Focused on learning how real software works by building projects, testing assumptions,',
          'and exploring where AI and web applications can fail.',
          '',
          `PERSONAL MISSION: "${PROFILE_INFO.missionStatement}"`,
        ],
        action: { type: 'NAVIGATE_SECTION', sectionId: 'about' },
      };

    case 'skills': {
      const lines: string[] = [
        'SKILLS MATRIX · HONEST CURRENT PROFICIENCY',
        '------------------------------------------',
      ];
      for (const group of SKILL_GROUPS) {
        lines.push(`[${group.code}] ${group.title.toUpperCase()}`);
        for (const item of group.items) {
          lines.push(`  • ${item.name} — [${item.level}]`);
          lines.push(`    ${item.detail}`);
        }
        lines.push('');
      }
      return {
        command: cleaned,
        lines,
        action: { type: 'NAVIGATE_SECTION', sectionId: 'skills' },
      };
    }

    case 'projects': {
      const lines: string[] = [
        'VERIFIED PROJECT INVENTORY · 5 PUBLIC GITHUB REPOSITORIES',
        '---------------------------------------------------------',
      ];
      for (const p of PROJECTS) {
        lines.push(`[${p.code}] ${p.title} (${p.language}) — ${p.category}`);
        lines.push(`  Summary:    ${p.whatIBuilt}`);
        if (p.liveUrl) {
          lines.push(`  Live Demo:  ${p.liveUrl}`);
        }
        lines.push(`  Repository: ${p.githubUrl}`);
        lines.push('');
      }
      lines.push(
        'Tip: Run "project bankism", "project notice", "project moltbook", "project skycast", or "project alexa".'
      );
      return {
        command: cleaned,
        lines,
        action: { type: 'NAVIGATE_SECTION', sectionId: 'projects' },
      };
    }

    case 'project bankism':
    case 'bankism':
      return formatProjectDetails('bankism', cleaned);

    case 'project notice':
    case 'project notice-helper':
    case 'notice':
      return formatProjectDetails('notice-helper', cleaned);

    case 'project moltbook':
    case 'moltbook':
    case 'cyberbuddy':
      return formatProjectDetails('moltbook', cleaned);

    case 'project skycast':
    case 'skycast':
      return formatProjectDetails('skycast', cleaned);

    case 'project alexa':
    case 'project studymate':
    case 'alexa':
    case 'studymate':
      return formatProjectDetails('alexa-studymate', cleaned);

    case 'achievements': {
      const lines: string[] = [
        'ACHIEVEMENTS & VERIFIED LEARNING LOG',
        '------------------------------------',
      ];
      for (const a of ACHIEVEMENTS) {
        lines.push(`[${a.code}] ${a.title} · ${a.context}`);
        lines.push(`  ${a.description}`);
        lines.push('');
      }
      return {
        command: cleaned,
        lines,
        action: { type: 'NAVIGATE_SECTION', sectionId: 'achievements' },
      };
    }

    case 'mission':
      return {
        command: cleaned,
        lines: [
          'CURRENT MISSION & DIRECTION',
          '---------------------------',
          `"${PROFILE_INFO.missionStatement}"`,
          '',
          'ACTIVE FOCUS AREAS:',
          '  1. Cybersecurity fundamentals and system failure analysis',
          '  2. AI safety and fail-closed prompt-injection defense mechanisms',
          '  3. Cloud computing fundamentals and static/serverless deployment on AWS',
          '  4. Shipping practical open-source repositories as a first-year student at UVCE Bengaluru',
        ],
        action: { type: 'NAVIGATE_SECTION', sectionId: 'about' },
      };

    case 'contact':
      return {
        command: cleaned,
        lines: [
          'EXTERNAL CHANNELS · VERIFIED LINKS',
          '----------------------------------',
          `  GitHub:   ${PROFILE_INFO.github}`,
          `  LinkedIn: ${PROFILE_INFO.linkedin}`,
          '',
          'No private phone numbers or personal credentials are stored on this system.',
        ],
        action: { type: 'NAVIGATE_SECTION', sectionId: 'contact' },
      };

    case 'theme':
      return {
        command: cleaned,
        lines: [
          'SYSTEM THEME CONTROLLER',
          '-----------------------',
          'Available visual themes:',
          ...THEMES.map((t) => `  • ${t.name.padEnd(12, ' ')} (${t.id}) — ${t.description}`),
          '',
          'Opening theme selector panel... (You can also run: theme cybercore | retro98 | neondream | softmode | terminal)',
        ],
        action: { type: 'OPEN_THEME_SELECTOR' },
      };

    case 'sudo unlock':
    case 'unlock':
      return {
        command: cleaned,
        lines: [
          '[AUTH GRANTED] ELEVATED PRIVILEGE ACCEPTED.',
          'Decrypting hidden partition: /usr/games/firewall-defender ...',
          'Launching SECRET ARCADE MODE · FIREWALL DEFENDER: SYSTEM BREACH...',
        ],
        action: { type: 'UNLOCK_ARCADE' },
      };

    case 'clear':
      return {
        command: cleaned,
        lines: [],
        action: { type: 'CLEAR' },
      };

    case 'exit':
      return {
        command: cleaned,
        lines: ['Closing terminal focus. Returning to SUPERPOWER.OS workspace...'],
        action: { type: 'EXIT' },
      };

    default: {
      if (normalized.startsWith('theme ')) {
        const arg = normalized.replace('theme ', '').trim();
        const matched = THEMES.find(
          (t) =>
            t.id === arg ||
            t.name.toLowerCase() === arg ||
            t.name.toLowerCase().replace(/\s+/g, '') === arg
        );
        if (matched) {
          return {
            command: cleaned,
            lines: [
              `Applying visual profile [${matched.code}] ${matched.name}...`,
              `Theme switched to ${matched.name}.`,
            ],
            action: { type: 'SET_THEME', themeId: matched.id },
          };
        }
      }

      const suggestion = suggestClosestCommand(normalized);
      const lines = [
        `Command not recognized: "${cleaned}"`,
        suggestion
          ? `Did you mean "${suggestion}"? Type "help" to view all valid commands.`
          : 'Type "help" to list all supported commands (e.g. whoami, skills, projects, sudo unlock).',
      ];
      return {
        command: cleaned,
        lines,
        isError: true,
      };
    }
  }
}

export interface PromptInspectionResult {
  prompt: string;
  verdict: 'ALLOW' | 'ESCALATE' | 'BLOCK';
  riskScore: number;
  triggeredRules: string[];
  explanation: string;
}

export function evaluateBankismPrompt(rawPrompt: string): PromptInspectionResult {
  const text = rawPrompt.trim();
  const lower = text.toLowerCase();

  if (!text) {
    return {
      prompt: '',
      verdict: 'ALLOW',
      riskScore: 0,
      triggeredRules: ['EMPTY_INPUT_NOOP'],
      explanation: 'Enter a sample banking prompt to test how Bankism Firewall screens instructions.',
    };
  }

  const triggeredRules: string[] = [];
  let riskScore = 10;

  if (
    lower.includes('ignore previous') ||
    lower.includes('ignore all') ||
    lower.includes('system prompt') ||
    lower.includes('override') ||
    lower.includes('bypass') ||
    lower.includes('jailbreak')
  ) {
    triggeredRules.push('INSTRUCTION_HIERARCHY_OVERRIDE');
    riskScore += 65;
  }

  if (
    lower.includes('transfer') ||
    lower.includes('wire') ||
    lower.includes('send money') ||
    lower.includes('withdraw') ||
    lower.includes('drain')
  ) {
    triggeredRules.push('SENSITIVE_FUNDS_MUTATION');
    riskScore += 35;
  }

  if (
    lower.includes('password') ||
    lower.includes('pin') ||
    lower.includes('api key') ||
    lower.includes('admin') ||
    lower.includes('sudo') ||
    lower.includes('all accounts')
  ) {
    triggeredRules.push('PRIVILEGE_OR_CREDENTIAL_PROBE');
    riskScore += 45;
  }

  riskScore = Math.min(100, riskScore);

  if (riskScore >= 70) {
    return {
      prompt: text,
      verdict: 'BLOCK',
      riskScore,
      triggeredRules,
      explanation:
        'Blocked prior to assistant execution: Detected prompt-injection pattern or unauthorized privilege/transfer instruction conflict.',
    };
  }

  if (riskScore >= 40) {
    return {
      prompt: text,
      verdict: 'ESCALATE',
      riskScore,
      triggeredRules,
      explanation:
        'Escalated for explicit human verification: Request touches sensitive account actions or ambiguous authority boundaries.',
    };
  }

  return {
    prompt: text,
    verdict: 'ALLOW',
    riskScore,
    triggeredRules: triggeredRules.length ? triggeredRules : ['READ_ONLY_SAFE_QUERY'],
    explanation:
      'Allowed: Query appears read-only and respects instruction hierarchy boundaries.',
  };
}
