# SkillSwap

SkillSwap helps people share skills, find peer mentors, and arrange local demo learning sessions.

## Run & Operate

- `pnpm install` — install workspace dependencies
- `pnpm --filter @workspace/skillswap run dev` — run SkillSwap in development
- `pnpm --filter @workspace/skillswap run build` — build the static app
- No database, API, or secrets are required for SkillSwap.

## Stack

- HTML, CSS, and vanilla JavaScript for the app; Vite is only the static development/build tool.
- pnpm workspace for package management.
- Browser `localStorage` for the single-device demo only.

## Where things live

- `artifacts/skillswap/index.html` — app document and entry point
- `artifacts/skillswap/src/main.js` — page rendering, navigation, and demo interactions
- `artifacts/skillswap/src/styles.css` — responsive UI styling
- `artifacts/skillswap/public/images/` — generated demo portraits and portfolio artwork
- `artifacts/skillswap/README.md` — run instructions and local-storage limitations

## Architecture decisions

- Keep the frontend framework-free: do not add React or another UI framework.
- This product is a browser-only demo, not a real multi-user service or secure authentication system.
- Seeded mentor/project examples use a separate localStorage key from user-created profiles, projects, and session requests.
- Do not present localStorage data as shared across people, browsers, or devices.

## Product

Discover peer mentors, exchange skills, manage a teacher profile and portfolio, and coordinate demo session requests through their status flow.

## User preferences

- The user explicitly requires HTML, CSS, and vanilla JavaScript only.
- Keep profiles, projects, and session requests in a clearly disclosed localStorage demo; do not imply real multi-user persistence.

## Gotchas

- Use the `@workspace/skillswap` pnpm filter from the workspace root; the Vite package uses the workspace's `catalog:` version.
- Local demo passwords are not encrypted. Never advise entering a real password or sensitive data.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
