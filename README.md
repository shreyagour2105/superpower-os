# SUPERPOWER.OS — Personal Operating System & Portfolio

**User Profile:** Shreya S Gour (`shreya@superpower`)  
**Tagline:** *“I BUILD. I BREAK. I SECURE.”*  
**Context:** AWS Student Builder Challenge (October 27–November 6, 2026)

---

## Overview

`SUPERPOWER.OS` is an interactive personal operating system and portfolio designed for Shreya S Gour, a first-year Information Science and Engineering student at UVCE Bengaluru exploring cybersecurity, AI safety, cloud computing, and emerging systems.

It combines **Cybercore × Retro Computing × Editorial Minimalism** into a functional, keyboard-accessible, static-deployable web application.

Additionally, a standalone single-file 3D `<model-viewer>` + GSAP beverage showcase is available at `/soda.html` (or via `?soda=1`).

---

## Interactive Features

1. **Cyber Mission Control (`src/components/CyberTerminal.tsx`)**
   - Supports 14 commands: `help`, `whoami`, `about`, `skills`, `projects`, `project bankism`, `project skycast`, `achievements`, `mission`, `contact`, `theme`, `sudo unlock`, `clear`, and `exit`.
   - Command history (`ArrowUp` / `ArrowDown`), `Tab` autocomplete, fuzzy typo suggestions, and touch-friendly quick command buttons.
2. **Secret Arcade Mode — Firewall Defender (`src/components/SecretArcadeModal.tsx`)**
   - Unlock via `sudo unlock` in the terminal or the top/footer Arcade triggers.
   - Playable HTML5 Canvas mini-game defending the perimeter against simulated threats (`PROMPT_INJECT`, `SQL_INJECTION`, `SYN_FLOOD`, `XSS_PAYLOAD`).
   - Supports keyboard (`ArrowLeft`/`ArrowRight` or `A`/`D`, `Space` to fire), pointer/tap targeting, and mobile touch controls. Audio is off by default with an optional Web Audio synthesizer toggle.
3. **Superpower Vending Machine (`src/components/InteractiveLabSection.tsx`)**
   - Dispenses verified facts across `SKILL`, `PROJECT`, `ACHIEVEMENT`, `FUN FACT`, and `CURRENT MISSION` categories with clipboard copy support.
4. **Digital Scratch Card (`src/components/InteractiveLabSection.tsx`)**
   - Interactive HTML5 Canvas metallic foil scratch card with mouse/touch support and an accessible `REVEAL MESSAGE` button.
5. **Virtual Fortune Cookie (`src/components/InteractiveLabSection.tsx`)**
   - Animated SVG fortune cookie revealing original engineering and debugging mottos.
6. **5-Theme Visual Switcher (`src/index.css`, `src/App.tsx`)**
   - Switch dynamically between `CYBERCORE`, `RETRO 98`, `NEON DREAM`, `SOFT MODE`, and `TERMINAL` with `localStorage` persistence.
7. **Retro 98 Desktop Mode (`src/components/RetroDesktopMode.tsx`)**
   - Optional classic windowed desktop environment with Start menu, taskbar, and minimize/maximize/close window controls.

---

## Local Development, Validation & Testing

```bash
# Install dependencies
npm install

# Run unit tests (Node built-in test runner via tsx)
npx --yes tsx --test src/utils/engine.test.ts

# Type-check / lint
npm run lint

# Build production static bundle (outputs to dist/)
npm run build

# Start local dev server on port 3000
npm run dev
```

---

## AWS Amplify Hosting Deployment Steps

1. Push this repository to your GitHub account (`https://github.com/shreyagour2105`).
2. Sign in to the **AWS Management Console** and open **AWS Amplify**.
3. Click **Create new app** → select **GitHub** and authorize your repository and branch.
4. Amplify will automatically detect `amplify.yml` at the project root:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. Click **Save and deploy**. Once Amplify finishes the build and provisioning steps, verify the generated `https://...amplifyapp.com` URL across desktop and mobile viewports.
