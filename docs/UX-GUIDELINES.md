# Depth UX rules

## Onboarding belongs to the agent

Ask exactly one stage question, then finish that stage before moving on. Stage 1: role + experience → practice homepage. Stage 2: personal/employer details + résumé → My Details. Stage 3: optional Gmail connection → Applications. Use Cloudflare storage by default. The user should not need to inspect this repository.

## Practice

Answers begin hidden. Reveal is an explicit action with aria-expanded and aria-controls. Keep metadata, copy and navigation easy to find. Browse questions begins collapsed to avoid a long distracting list. Search and topic selection narrow content without losing the user's practiced markers. Show an honest no-match state and disable navigation at actual boundaries.

Changing questions moves focus to the title and scrolls the question into view. Left/right arrows navigate; Space reveals when focus is not inside a control. Never hijack keyboard input in forms, buttons, summaries or code blocks. Preserve swipe gestures while allowing code scrolling. Respect prefers-reduced-motion for animations.

Practice progress is browser-local and may be exported/reset; label it accordingly. Applications are persistent server records, not browser-local progress. Keep these concepts separate.

## Copy

Icon-only button: transparent background and accent-colored icon strokes, with no visible border or label. Keep a 44px transparent hit area and an accessible name. On clipboard success, swap the copy icon for a theme-colored checkmark and show a “Copied!” tooltip for two seconds, then reset. Use subtle fade/scale and check-stroke drawing; disable animations for reduced motion. Never show success before the clipboard write succeeds. Provide an accessible name even for icon-only buttons. Use the Clipboard API on the user's click and announce success through a polite live region. Provide a selected-text dialog when clipboard access fails. Copy full question text or the exact requested field; copied URLs must not include decorative arrows. Preserve address line breaks and email formatting.

## Details

Make contact information scannable, copyable and optional. Do not invent missing details. Keep employer signature order stable. Expand individual fields only when needed. A résumé is an actual provided file; omit the download until it exists. Outreach is two concise paragraphs between a subject/greeting and signature, including thanks for the recipient's time.

## Applications

Quick add should need only ordinary application information. Preserve fields after a save error. Show validation errors in the dialog. Confirm saved state only after the server accepts it. Reject stale versions rather than overwriting concurrent edits. Retain displayed data when Refresh fails and label the failure.

Use explicit stages: Applied, Recruiter discussion, Interviewing, Offer, Rejected, Withdrawn. Flag ambiguity for review. An unanswered email is not a rejection. Preserve manual status choices across email imports and show a newer email suggestion separately when it differs. Avoid duplicate records.

Refresh results reloads stored records. It does not read Gmail. Never call it Sync now. Gmail automation is optional and must be tested with the intended unattended writer connection before it is called working. Display truthful last-success time; no automatic advancing on failure. Do not copy a schedule or connection from the template author.

## Accessibility and quality

Semantic headings and labeled controls; visible focus; textual status labels; native details/dialog where appropriate; no hover-only information. Review phone and tablet layouts, long names/URLs, keyboard flow, 200% zoom and reduced motion. Check theme contrast with measurement rather than visual confidence. Accessibility is an ongoing verification task, not an untested conformance claim.
