# SkillSwap

SkillSwap is a static, vanilla JavaScript peer-learning demo. It is built with a native HTML entry, CSS, and browser JavaScript modules; Vite is only the development/build tool.

## Run locally

From the workspace root:

```sh
pnpm install
pnpm --filter @workspace/skillswap run dev
```

For a production build, run `pnpm --filter @workspace/skillswap run build`. The Vite config uses `PORT` and `BASE_PATH` when provided. It defaults to port `5173` and `/` for local development outside the hosted artifact workflow.

## Try the flows

- Choose **Try as student** or **Try as teacher** on the login screen. The student demo identity is a local sample account; the teacher entry opens Asha's clearly labeled demo profile.
- To test requests end-to-end between the two demo identities, send a request as the student, sign out, then log in as teacher to confirm or suggest a time. Sign back in as student to accept a suggestion.
- You can also make a local profile as Student, Teacher, or Both. Teacher / Both accounts can edit their public profile (including portrait upload, bio, skills, availability, and learning preferences) and create portfolio projects. Seeded demo profiles are read-only.
- Demo mentors and their sample projects are identified in the interface. User profiles, projects, session requests, and the currently selected local demo identity are stored separately.

## Demo storage and privacy

There is no API, backend, shared account system, or external authentication. All account details and interactions remain in this browser's `localStorage`; they do not sync to another browser or device. This is demo persistence, **not secure authentication**. Do not enter a real password or sensitive personal information.

Storage uses versioned keys:

- `skillswap.demo.v1` — seeded, labeled demo mentor and portfolio records only (seed shape versioned internally).
- `skillswap.users.v1` — locally created demo profiles.
- `skillswap.projects.v1` — user-created portfolio projects.
- `skillswap.requests.v1` — local booking requests and status transitions.
- `skillswap.identity.v1` — currently selected local profile.

User-uploaded images are previewed and saved as browser data URLs, limited to 1.5 MB each. If storage is full or browser storage is unavailable, the app reports that saving failed. Clear the browser's site data to reset this local demo. Demo seed data is separate and never merged into the user profile/project buckets.
