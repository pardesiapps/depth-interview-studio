# Depth Interview Studio — agent operating instructions

Read README.md, START-HERE.md and docs/AGENT-SETUP.md before implementation. This repository is both a working starter and the authoritative design reference. The person supplying its link should never need to read files, use Git, run a terminal or understand hosting configuration.

## Required onboarding: exactly one stage question at a time

1. First ask ONLY: “What is your job profile, and how many years of experience do you have?” Wait for their answer. Build and verify the interview practice homepage using the existing theme and at least 50 substantive questions tailored to that answer. Do not request their résumé, contacts, storage preference or account connections in stage 1.
2. Only after the homepage is complete and presented, ask ONLY: “Please share the personal details, employer details (if applicable), and résumé you’d like on your My Details page.” Wait. Implement and verify that page from the information actually provided. Omit unavailable optional fields; never invent personal information.
3. Only after My Details is complete and presented, ask ONLY: “Would you like to connect Gmail so I can track your job applications?” Wait. Build the Applications page with persistent records, editable statuses, search and Quick add. If yes, use THEIR connection, request any necessary provider consent, inspect relevant messages, and verify actual read → write → readback. If no, support manual tracking. Do not schedule sync before its unattended writer works.

Each question may gather the naturally related details in its own stage. Do not send all three questions at once. Do not ask an extra questionnaire about tools, providers, colors or hosting; infer reasonable defaults from the user's role and existing design. If the user explicitly wants only a subset or gives information early, honor that; do not force repetition.

## Defaults and boundaries

- Cloudflare R2 through the owner's new private Site is the default persistent storage. Never ask the user to pick a database during onboarding.
- Preserve all five palettes, light/dark mode, three style variants, typography, page layouts, components, keyboard support and reduced motion. Read docs/DESIGN-SYSTEM.md and docs/UX-GUIDELINES.md.
- The supplied Java deck is a sample to replace when the user's domain differs. Preserve question IDs consistently across questions.js, depth.js and examples.js. Adapt language badges and reference links for SQL, Python, PySpark, etc.
- Never include this template author's personal records or credentials. There are none in the clean template; do not fetch them from the original website.
- All hosted personal-data routes must require verified owner authorization. Set OWNER_EMAIL using hosting secrets. Keep the Site owner-private. Do not weaken authorization to make a test pass.
- No secrets or private data in Git, browser bundles, URLs, schedules, screenshots or logs. The user may explicitly authorize storing their public professional profile in their own private Site; explain the distinction between private deployment and public source before including it in any repository.
- Do not expose /api/sync without authentication. Use the owner's authenticated Site MCP writer. Connected Gmail access and Site writer access are separate; never infer one from the other.
- The local preview simulates identity on 127.0.0.1 only. Never deploy scripts/preview.mjs or treat its results as evidence of production authentication.
- No fake sync: “Refresh results” reloads saved records. Do not label it “Sync now”. Do not create dummy applications or claim integration works from a successful deployment alone.
- Use available Sites skills/tools when deploying to Sites; register a NEW Site for the new owner. hosting.example.json is an example, not a live manifest. Never reuse someone else's Site/project/plugin/automation IDs.
- Ask for a schedule only after optional syncing works, or use a user-requested time. If no schedule has been requested, offer one specific daily time after verification; do not silently schedule.
- Publishing a template update never authorizes publishing personal data. Follow docs/UPGRADING.md.

## Verification

Run npm run check. Preview all three pages. Check copy text, reveal, search, navigation, saved progress, appearance, responsive layouts, form validation, owner-only writes, persistent readback and conflicting edits. Verify denied access as well as allowed access. Report features that remain unverified. Follow the owner's current instructions over these defaults.
