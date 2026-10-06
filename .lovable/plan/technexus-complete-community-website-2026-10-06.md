# TechNexus — complete community website

## Brand and design
- Use your uploaded official logo unchanged in the navigation and footer. Derive a small browser icon from the same artwork without redesigning it.
- Build a navy, gold, white, and neutral university-community identity with readable typography, spacious sections, subtle orbit movement, and reduced-motion support.
- Preserve the requested homepage wording. Start all statistics at zero, show four “Core Member / Add Position” placeholders, and never invent people, events, contacts, or achievements.

## Public website
- Build Home, About, Activities, Members, Core Team, Events, event details, Volunteer, Join, Contact, and polished not-found pages.
- Include mobile navigation, searches and filters, registration links when configured, loading/error/empty states, and graceful image fallbacks.
- Save validated join applications, volunteer applications, and contact messages with duplicate protection and safe success/error feedback.

## Administrator workspace
- Secure administrator sign-in and sign-out, password recovery, and permission-checked access. No extra administrator profile data is needed.
- Provide real database counts and full management of members, core team, activities, and events.
- Provide application/message review, status changes, and deletion.
- Allow editing homepage/about/mission/vision/objectives/CTA/footer content, contact information, social links, and verification settings.
- Support validated image uploads for club content.
- Provision the first administrator securely; never ship default passwords or grant administrator access to arbitrary signups.

## Quality and launch
- Add unique page metadata, structured data where truthful, sitemap, robots configuration, and a logo-derived browser icon.
- Verify public pages, forms saving and reading back, administrator permissions, CRUD persistence, direct links, missing events, and mobile/desktop layouts.
- Run a security review before requesting publishing. Provide the expected published address, administrator access guidance, and any real remaining configuration or verification limits.

## Technical approach
- Use this project's supported React/TypeScript, TanStack Start/Router, Tailwind v4, and Lovable Cloud PostgreSQL/authentication/storage rather than introducing separate Express or React Router applications.
- Use managed authentication and a separate administrator-role table; no administrator profiles. Permission checks apply on the server and in database policies, not only on pages.
- Store durable content and submissions in PostgreSQL, use schema migrations with explicit grants and row-level security, and seed only safe requested content/placeholders.
- Use validated server functions for internal operations; do not introduce redundant REST endpoints unless an external integration needs them.
- Use the supported managed session model rather than claiming custom bcrypt/HTTP-only cookie authentication. Any security-model differences from the preferred brief will be stated explicitly.
- Keep the uploaded logo as an immutable hosted asset, with no edits to its design or wording.