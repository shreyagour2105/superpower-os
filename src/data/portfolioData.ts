export type ThemeId = 'cybercore' | 'retro98' | 'neondream' | 'softmode' | 'terminal';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  code: string;
  description: string;
  swatchBg: string;
  swatchAccent: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'cybercore',
    name: 'CYBERCORE',
    code: 'SYS.01',
    description: 'Deep navy & emerald-teal atmosphere, frosted glass, and blush-pink accents.',
    swatchBg: '#0b4f8a',
    swatchAccent: '#fbcfe8',
  },
  {
    id: 'retro98',
    name: 'RETRO 98',
    code: 'SYS.02',
    description: 'Playful classic 1998 desktop computing aesthetic.',
    swatchBg: '#008080',
    swatchAccent: '#000080',
  },
  {
    id: 'neondream',
    name: 'NEON DREAM',
    code: 'SYS.03',
    description: 'Vivid cyberpunk violet radial glow, blush pink, and electric cyan.',
    swatchBg: '#3b0764',
    swatchAccent: '#22d3ee',
  },
  {
    id: 'softmode',
    name: 'SOFT MODE',
    code: 'SYS.04',
    description: 'Muted pastel surfaces and gentle editorial contrast.',
    swatchBg: '#e2e8f0',
    swatchAccent: '#0f766e',
  },
  {
    id: 'terminal',
    name: 'TERMINAL',
    code: 'SYS.05',
    description: 'Minimal monochrome phosphor terminal styling.',
    swatchBg: '#051b11',
    swatchAccent: '#4ade80',
  },
];

export interface SkillItem {
  name: string;
  level: 'BEGINNER' | 'PROJECT EXPERIENCE' | 'CURRENTLY LEARNING';
  detail: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  code: string;
  items: SkillItem[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'programming',
    title: 'Programming Foundations',
    code: 'MOD_01',
    items: [
      {
        name: 'Python',
        level: 'BEGINNER',
        detail: 'Building foundational scripts, rule-based checks, and Gemini agent workflows.',
      },
      {
        name: 'C / C++',
        level: 'BEGINNER',
        detail: 'Studying structured programming, memory fundamentals, and core data types.',
      },
      {
        name: 'HTML, CSS, JavaScript & TypeScript',
        level: 'PROJECT EXPERIENCE',
        detail: 'Building responsive interfaces, strict-mode guardrail logic, and REST API apps.',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Development & Tools',
    code: 'MOD_02',
    items: [
      {
        name: 'Git & GitHub',
        level: 'PROJECT EXPERIENCE',
        detail: 'Version control, managing public repositories, and iterative project builds.',
      },
      {
        name: 'GitHub Pages & Vercel Serverless',
        level: 'PROJECT EXPERIENCE',
        detail: 'Deploying static web apps and serverless API routes that keep keys off the client.',
      },
      {
        name: 'Working with REST APIs',
        level: 'PROJECT EXPERIENCE',
        detail: 'Integrating Open-Meteo endpoints, Google Gemini APIs, and structured JSON parsing.',
      },
      {
        name: 'AI-Assisted Development Tools',
        level: 'PROJECT EXPERIENCE',
        detail: 'Using modern AI coding workflows thoughtfully while verifying output logic.',
      },
    ],
  },
  {
    id: 'exploration',
    title: 'Areas of Exploration',
    code: 'MOD_03',
    items: [
      {
        name: 'Cybersecurity',
        level: 'CURRENTLY LEARNING',
        detail: 'Investigating how systems fail, threat modeling, and defensive engineering.',
      },
      {
        name: 'AI Safety & Prompt-Injection Defense',
        level: 'CURRENTLY LEARNING',
        detail: 'Exploring fail-closed input screening, instruction hierarchy conflicts, and safe AI boundaries.',
      },
      {
        name: 'Cloud Computing',
        level: 'CURRENTLY LEARNING',
        detail: 'Learning cloud infrastructure fundamentals, IAM concepts, and AWS Amplify hosting.',
      },
      {
        name: 'Generative AI & Agent Workflows',
        level: 'CURRENTLY LEARNING',
        detail: 'Studying LLM capabilities, Model Context Protocol (MCP), and structured outputs.',
      },
    ],
  },
];

export type ProjectId =
  | 'bankism'
  | 'notice-helper'
  | 'moltbook'
  | 'skycast'
  | 'alexa-studymate';

export interface ProjectInfo {
  id: ProjectId;
  code: string;
  title: string;
  shortTitle: string;
  language: string;
  category: string;
  isPrimaryAnchor?: boolean;
  orbitAngleDeg: number;
  accentColor: string;
  bgGradient: { inner: string; mid: string; outer: string };
  visualConcept: string;
  problemStatement: string;
  whatIBuilt: string;
  designGoals: string[];
  technologies: string[];
  whatILearned: string;
  githubUrl: string;
  liveUrl?: string;
}

export const PROJECTS: ProjectInfo[] = [
  {
    id: 'bankism',
    code: 'PRJ_01',
    title: 'Bankism Firewall',
    shortTitle: 'Bankism',
    language: 'TypeScript',
    category: 'AI Security · Banking Transaction Protection',
    isPrimaryAnchor: true,
    orbitAngleDeg: 0,
    accentColor: '#fbcfe8',
    bgGradient: { inner: '#133a6c', mid: '#091d3a', outer: '#030914' },
    visualConcept: '3D security shield, protected transaction nodes, threat indicators, and blocked-attack pulses.',
    problemStatement:
      'Conversational banking assistants can be tricked into executing unauthorized financial actions when untrusted natural-language requests contain prompt-injection attempts or policy conflicts.',
    whatIBuilt:
      'A defensive blue-team AI security firewall written in TypeScript that intercepts and screens untrusted natural-language banking requests before they reach privileged financial execution functions.',
    designGoals: [
      'Screen untrusted instructions with a fail-closed security policy.',
      'Identify prompt injection and policy conflicts before execution.',
      'Produce structured security verdicts (ALLOW, ESCALATE, BLOCK).',
      'Protect downstream transaction nodes from unauthorized actions.',
    ],
    technologies: ['TypeScript', 'Fail-Closed Guardrails', 'Vitest', 'HTML/CSS', 'Vercel'],
    whatILearned:
      'How subtle instruction overrides attempt to bypass keyword filters, why security guardrails must default to blocking or escalating on ambiguity, and how to test rules with automated unit tests.',
    githubUrl: 'https://github.com/shreyagour2105/bankism-firewall',
    liveUrl: 'https://bankism-firewall.vercel.app/',
  },
  {
    id: 'notice-helper',
    code: 'PRJ_02',
    title: 'Notice Helper AI',
    shortTitle: 'Notice AI',
    language: 'JavaScript',
    category: 'Structured Document Extraction · Gemini API',
    orbitAngleDeg: -55,
    accentColor: '#5eead4',
    bgGradient: { inner: '#0b6b63', mid: '#053835', outer: '#021211' },
    visualConcept: 'Structured college notice card with parsed deadline metadata and AI extraction scanlines.',
    problemStatement:
      'Students frequently receive lengthy or unstructured college notices (as PDFs, images, or raw text) where key deadlines, venues, and target audiences are easy to miss.',
    whatIBuilt:
      'A web tool where students paste or upload a college notice (PDF, PNG, JPG, WEBP, or .txt) and a serverless Gemini endpoint extracts the title, notice type, deadline, date/time, venue, link, and target audience into structured JSON.',
    designGoals: [
      'Keep the Gemini API key strictly server-side inside a serverless function (/api/extract).',
      'Parse unstructured notices into a clean, scannable summary with a one-line reminder.',
      'Highlight missing or ambiguous notice details honestly instead of guessing.',
      'Render extracted fields safely in the DOM.',
    ],
    technologies: ['JavaScript', 'HTML5 & CSS3', 'Google Gemini API', 'Serverless API Route'],
    whatILearned:
      'Designing server-side API proxies so credentials never leak to browser code, enforcing structured JSON schemas from LLM responses, and handling multi-format uploads cleanly.',
    githubUrl: 'https://github.com/shreyagour2105/notice-helper-ai',
  },
  {
    id: 'moltbook',
    code: 'PRJ_03',
    title: 'Moltbook CyberBuddy',
    shortTitle: 'CyberBuddy',
    language: 'Python',
    category: 'Cybersecurity AI Agent · Controlled Automation',
    orbitAngleDeg: 55,
    accentColor: '#c084fc',
    bgGradient: { inner: '#3b1d66', mid: '#1e0b3b', outer: '#080312' },
    visualConcept: 'Connected AI agent core, cybersecurity discussion nodes, and terminal signal relays.',
    problemStatement:
      'Automated social or educational agents can easily become noisy or unsafe without clear topic boundaries, rate limits, and rule-based safety checks.',
    whatIBuilt:
      'A Python-based AI agent for Moltbook that explores cybersecurity discussions, generates context-aware comments, and publishes scheduled educational posts using Google Gemini paired with rule-based safety checks.',
    designGoals: [
      'Focus agent responses specifically on cybersecurity and educational topics.',
      'Combine generative AI output with deterministic rule-based safety checks.',
      'Enforce publishing limits to ensure responsible, controlled automation.',
      'Structure agent configuration and logging clearly in Python.',
    ],
    technologies: ['Python', 'Google Gemini SDK', 'Rule-Based Safety Checks', 'Automated Scheduling'],
    whatILearned:
      'Why autonomous agents need deterministic guardrails and rate limits around LLM calls, and how to structure modular Python automation scripts.',
    githubUrl: 'https://github.com/shreyagour2105/moltbook-cyberbuddy',
  },
  {
    id: 'skycast',
    code: 'PRJ_04',
    title: 'SkyCast Weather App',
    shortTitle: 'SkyCast',
    language: 'HTML, CSS, JavaScript',
    category: 'Atmospheric Dashboard · Open-Meteo REST API',
    orbitAngleDeg: -135,
    accentColor: '#7dd3fc',
    bgGradient: { inner: '#0b4f8a', mid: '#04294e', outer: '#010c14' },
    visualConcept: 'Atmospheric globe with layered clouds, weather symbols, and 5-day forecast rings.',
    problemStatement:
      'Accessing current weather telemetry and multi-day forecasts for global cities quickly without cluttered interfaces or exposed private API keys.',
    whatIBuilt:
      'A responsive weather forecast application built with HTML, CSS, and vanilla JavaScript using the Open-Meteo Geocoding and Forecast APIs for worldwide city search, current conditions, and a 5-day forecast.',
    designGoals: [
      'Chain geocoding lookup and meteorological forecast requests asynchronously.',
      'Display temperature, feels-like, humidity, wind speed, and 5-day daily highs/lows.',
      'Support instant Celsius / Fahrenheit unit toggling.',
      'Provide clear loading and error handling across desktop and mobile viewports.',
    ],
    technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Open-Meteo API', 'GitHub Pages'],
    whatILearned:
      'Coordinating multi-step REST API calls in vanilla JavaScript, managing UI state transitions for unit conversion, and deploying static apps via GitHub Pages.',
    githubUrl: 'https://github.com/shreyagour2105/skycast-weather-app',
    liveUrl: 'https://shreyagour2105.github.io/skycast-weather-app/',
  },
  {
    id: 'alexa-studymate',
    code: 'PRJ_05',
    title: 'Alexa StudyMate',
    shortTitle: 'StudyMate',
    language: 'JavaScript',
    category: 'Voice & AI Study Assistant · Assignment Tracker',
    orbitAngleDeg: 135,
    accentColor: '#fda4af',
    bgGradient: { inner: '#4c1d4b', mid: '#260d29', outer: '#0b030d' },
    visualConcept: 'Floating study notebook, assignment tracker cards, and browser voice-wave graphics.',
    problemStatement:
      'Students juggling coursework need a lightweight workspace that combines conversational study help with practical assignment tracking.',
    whatIBuilt:
      'An independent student productivity assistant built with JavaScript and a server-side Gemini API integration, featuring multi-turn study chat, optional browser voice input/output via Web Speech API, and assignment tracking.',
    designGoals: [
      'Route Gemini requests through a server-side endpoint to keep the `.env` API key private.',
      'Maintain recent conversation context for coherent follow-up study questions.',
      'Integrate Web Speech API for optional voice input and speech synthesis replies.',
      'Support creating, completing, filtering, and deleting student assignments.',
    ],
    technologies: ['JavaScript', 'Node/Express Backend', 'Google Gemini API', 'Web Speech API'],
    whatILearned:
      'Combining conversational AI endpoints with CRUD state persistence for assignments, and progressively enhancing interfaces with browser speech APIs.',
    githubUrl: 'https://github.com/shreyagour2105/alexa-studymate',
  },
];

export interface AchievementItem {
  id: string;
  code: string;
  title: string;
  context: string;
  category: string;
  description: string;
}

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'mcp-quiz',
    code: 'LOG_01',
    title: 'Top 1% in the MCP Quiz',
    context: 'Evam Labs Workshop — "How to Make LLMs Talk to Your Data"',
    category: 'Verified Workshop Distinction',
    description:
      'Placed in the top 1% of participants in the Model Context Protocol (MCP) assessment exploring how large language models connect safely and effectively to structured data sources.',
  },
  {
    id: 'promptwars',
    code: 'LOG_02',
    title: 'PromptWars × UVCECodes Participant',
    context: 'Bankism Firewall Project Showcase',
    category: 'Hackathon & Builder Event',
    description:
      'Built and presented the Bankism Firewall project exploring fail-closed prompt-injection defense and policy screening for AI banking assistants.',
  },
  {
    id: 'gcp-badges',
    code: 'LOG_03',
    title: 'Google Cloud Skill Badges',
    context: 'Cloud Computing, IAM & Pre-trained Speech/Language APIs',
    category: 'Cloud Learning Path',
    description:
      'Completed hands-on cloud learning labs covering virtual compute basics, Identity and Access Management (IAM) permissions, and pre-trained speech and natural language APIs.',
  },
  {
    id: 'uvce-learning',
    code: 'LOG_04',
    title: 'Information Science & Technical Workshops',
    context: 'UVCE Bengaluru · First-Year Student Builder',
    category: 'Academic & Community Exploration',
    description:
      'Actively shipping public repositories across AI security, serverless document extraction, Python agents, and web apps while pursuing first-year Information Science and Engineering studies.',
  },
];

export type VendingCategory =
  | 'SKILL'
  | 'PROJECT'
  | 'ACHIEVEMENT'
  | 'FUN FACT'
  | 'CURRENT MISSION';

export interface VendingItem {
  id: string;
  slot: string;
  category: VendingCategory;
  title: string;
  description: string;
}

export const VENDING_ITEMS: VendingItem[] = [
  {
    id: 'v-bankism',
    slot: 'A1',
    category: 'PROJECT',
    title: 'Bankism Firewall: Fail-Closed TypeScript Guardrails',
    description:
      'Bankism Firewall intercepts untrusted natural-language banking requests in TypeScript and blocks or escalates suspicious prompt-injection attempts before privileged execution.',
  },
  {
    id: 'v-notice',
    slot: 'A2',
    category: 'PROJECT',
    title: 'Notice Helper AI: Server-Side Gemini Extraction',
    description:
      'Extracts deadlines, venues, and target audiences from uploaded college notices via a serverless /api/extract route so the Gemini API key stays strictly off the client.',
  },
  {
    id: 'v-moltbook',
    slot: 'B1',
    category: 'PROJECT',
    title: 'Moltbook CyberBuddy: Controlled Python Agent',
    description:
      'Pairs Google Gemini with deterministic rule-based safety checks and publishing limits to discuss cybersecurity topics responsibly in Python.',
  },
  {
    id: 'v-skycast',
    slot: 'B2',
    category: 'PROJECT',
    title: 'SkyCast: Two-Step Open-Meteo Pipeline',
    description:
      'Resolves global city names via Open-Meteo Geocoding first, then fetches current weather and 5-day daily highs/lows with Celsius/Fahrenheit toggling.',
  },
  {
    id: 'v-studymate',
    slot: 'C1',
    category: 'PROJECT',
    title: 'Alexa StudyMate: Voice & Assignment Tracker',
    description:
      'Combines server-side Gemini study assistance with Web Speech API voice input/output and persistent assignment tracking for students.',
  },
  {
    id: 'v-mcp',
    slot: 'C2',
    category: 'ACHIEVEMENT',
    title: 'Top 1% in Evam Labs MCP Quiz',
    description:
      'Earned Top 1% in the quiz at the "How to Make LLMs Talk to Your Data" workshop by Evam Labs, diving into how LLMs interface with external data tools.',
  },
  {
    id: 'v-cloud',
    slot: 'D1',
    category: 'ACHIEVEMENT',
    title: 'Google Cloud IAM & Compute Labs',
    description:
      'Earned Google Cloud Skill Badges exploring least-privilege IAM roles, compute instances, and pre-trained speech and language APIs.',
  },
  {
    id: 'v-mission',
    slot: 'D2',
    category: 'CURRENT MISSION',
    title: 'First-Year Builder at UVCE Bengaluru',
    description:
      'Studying Information Science and Engineering at UVCE Bengaluru and shipping five public repositories across AI security, agents, and web systems.',
  },
];

export interface ScratchCardItem {
  id: string;
  label: string;
  headline: string;
  message: string;
  subtext: string;
}

export const SCRATCH_CARDS: ScratchCardItem[] = [
  {
    id: 'sc-1',
    label: 'CORE PHILOSOPHY · 01',
    headline: 'Understand. Break. Secure.',
    message:
      '“To understand how systems work, discover where they fail, and build safer, more useful technology.”',
    subtext: 'Shreya’s personal builder mission at UVCE Bengaluru.',
  },
  {
    id: 'sc-2',
    label: 'PROJECT INSIGHT · 02',
    headline: 'Fail-Closed By Default',
    message:
      'In Bankism Firewall, every prompt is evaluated for instruction overrides before reaching financial functions—because convenience should never outrank safety.',
    subtext: 'Built in TypeScript for PromptWars × UVCECodes.',
  },
  {
    id: 'sc-3',
    label: 'SYSTEM SECRET · 03',
    headline: 'Hidden Arcade Access Code',
    message:
      'Type "sudo unlock" inside the Cyber Mission Control terminal (or click the Arcade button in the header) to launch FIREWALL DEFENDER: SYSTEM BREACH.',
    subtext: 'Defend the Bankism node to unlock the 5-project victory vault.',
  },
];

export const FORTUNE_MESSAGES: string[] = [
  'Curiosity is a debugging tool.',
  'Every system has assumptions. Find them.',
  'Build something. Break your assumptions. Learn.',
  'A guardrail that fails silently is just a welcome mat.',
  'Read the error message twice before changing the code once.',
  'Simplicity is the strongest security boundary.',
  'Never leave an API key in client-side code.',
  'Untrusted input is the most honest stress test a system will ever face.',
];

export const PROFILE_INFO = {
  name: 'Shreya S Gour',
  handle: 'shreya@superpower',
  role: 'First-Year Information Science & Engineering Student',
  institution: 'UVCE Bengaluru (University Visvesvaraya College of Engineering)',
  tagline: 'I BUILD. I BREAK. I SECURE.',
  heroSubcopy:
    'First-year Information Science student exploring cybersecurity, AI safety, and the systems behind the technology we use.',
  missionStatement:
    'To understand how systems work, discover where they fail, and build safer, more useful technology.',
  challengeContext: 'AWS Student Builder Challenge (October 27–November 6, 2026)',
  github: 'https://github.com/shreyagour2105',
  linkedin: 'https://linkedin.com/in/shreya-s-gour-4820762b1',
};
