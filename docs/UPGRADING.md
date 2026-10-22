# Maintaining and adopting template releases

The template is a shared DESIGN AND SETUP baseline. Each user's private deployment owns its profile, résumé, application records, connections and hosting identity.

## Maintainer workflow

1. Improve the reusable code or design in this repository; keep personal live-site changes separate.
2. If importing theme changes from the original private implementation, run `npm run theme:import -- /absolute/path/to/source/public`. This copies ONLY style.css and applications.css; it never copies HTML, profiles, résumés, credentials or deployment identifiers. Review the diff.
3. Update design/UX docs and CHANGELOG.md, run npm run check, and visually check the design-system page and all three pages in light/dark palettes and style variants.
4. Use semantic versions: patch for compatible fixes, minor for compatible additions, major for breaking setup/data changes. Tag releases. Do not commit generated dist output, real profiles, uploads or local data.
5. Publish a release describing migration steps and verification limits. A release of the template does not redeploy recipients' sites.

## Recipient agent workflow

When the user asks “Update my studio from the template”, inspect the installed version and the new release notes. Compare changes before applying them. Preserve profile.js values in the recipient's PRIVATE deployment, question content, applications, existing storage, secrets, Site identity and schedule. Never blindly reset or copy the entire template over the user's working directory.

Import theme-only patches from public/style.css and public/applications.css first when that is all the user wants; regenerate theme/palettes.json. Apply functional changes separately with appropriate checks. Back up existing profile/configuration and export application records privately before any breaking migration. Do not place those backups in the public repository.

Record the adopted template version in a private deployment note. Verify behavior after merging. Do not promise automatic updates: adopting a version requires a deliberate merge/review by the user's agent, and external accounts remain under the recipient's control.
