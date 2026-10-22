# Depth design system — 1.0.2

The live visual authority is public/style.css, with application-page additions in public/applications.css. Its cascade deliberately preserves the established studio appearance. Do not re-create the design from a prose approximation or run an unsolicited visual redesign.

## Color contract

Set data-theme to green, blue, purple, amber or grey on the root element. Set data-mode to light or dark. Set data-style to default, playful or calm. These settings are independent and persist in depth-theme, depth-mode and depth-style browser preferences.

Use semantic variables: --paper (page), --surface (cards; light fallback white), --ink (primary text), --muted (supporting text), --line (structural borders), --accent and --accent-hover (actions), --on-accent (contrast on filled primary actions), --accent-soft (subtle hover/selection), --accent-tint (explanation surfaces), --accent-mid and --accent-line (emphasis/borders), --body-text (explanation prose), --browse and --track. --green is a legacy alias used by existing components, including non-green themes. Do not hard-code a green action in a different palette.

Resolved values for all five light and five dark palettes are in theme/palettes.json. They are derived from the root CSS cascade using npm run tokens; do not hand-edit this generated file. All dark palettes share neutral charcoal page/card surfaces; theme hue belongs to accent text, icon strokes, borders and actions rather than the page background. A palette preference should apply consistently on every page. Palette colors do not independently encode application status.

## Typography

DM Sans: interface/body and detailed prose. Manrope: brand and primary headings. Nunito: specific playful headings and browse badges. Use system fallbacks when Google Fonts is unavailable. Font loading currently uses Google Fonts; self-host licensed font files if the deployment requires no third-party font requests.

The brand is 29px in the base desktop header. The landing title is fluid at clamp(38px, 4.5vw, 57px), with Manrope 600 and 1.14 line height. Question titles use the existing .card h2 rules, including responsive/style overrides. Detailed answer and scenario text uses generous 1.7–1.85 line height. Code uses system monospace, 14px desktop / 13px compact, and 1.7 line height. The stylesheet is authoritative for computed sizes; old base declarations may be overridden later in the file.

## Layout and spacing

Main practice content has a 1200px maximum width; desktop uses a 220px topic rail and a flexible question column with a 40px gap. Collapse the desktop layout at the existing 850px breakpoint. Compact layouts use the existing 600px breakpoint (plus targeted 420px refinements). Details transition from three top contact columns to two and then one; the employer signature and long email template span the grid. Applications use an open row layout rather than a wall of identical cards.

Use existing component paddings rather than reducing whitespace to fit more content. Long email addresses, URLs and names must wrap; code scrolls horizontally inside its own container. Headers may wrap on compact layouts. Do not let the whole page overflow horizontally.

## Components

Primary buttons are filled with --accent and use --on-accent. Quiet buttons have structural borders and gain a subtle accent-soft hover. Copy buttons are OUTLINED: transparent background, theme-colored icon strokes, border and label. Their interior remains transparent when copied; a brief checkmark, “Copied!” tooltip and live confirmation communicate success. Hover may use a subtle theme tint, not a solid fill. Disabled controls alone use lower opacity.

Question cards contain metadata, title, copy, reveal and structured answer blocks. Scenario panels are secondary surfaces with the existing accent treatment. Code panels use a language badge, title, scrollable monospace content, explanation and caveat.

Contact cards support individual copying. The employer signature is one block, ordered email → company → address → phone → website, with optional individual field controls in native details/summary. Résumés are private downloads, not long pasted text previews.

Forms use explicit labels, appropriate email/URL/date inputs, 44px minimum control height where already applied, visible focus and inline errors. Dialogs return the user to the underlying task. Statuses include visible text; do not depend on color alone. Application writes confirm only after persistence succeeds.

## Style variants

Default preserves the established question title treatment and compact structured cards. Playful adds selected Nunito text, heavier borders, rounded badges and restrained offset shadows. Calm increases card padding, line height and rounded controls, and removes some hard panel edges. These are variants of one system; all remain usable in every theme and mode.

## Changes

Read docs/UPGRADING.md. Change semantic tokens before individual components where practical. Check every palette/mode combination after color edits, and all three variants after layout/typography changes. Visual consistency does not by itself establish WCAG contrast compliance; measure contrast for changed text/action combinations before claiming compliance.

Header links and the appearance control use the shared --control-font and --control-weight style tokens: DM Sans 600 by default, Nunito 800 in Playful, and DM Sans 500 in Calm. Desktop size is 13px; compact size is 12px. Active-page color changes do not override the shared font treatment.
