# TechNexus roadmap

- [x] Configure Cloud, authentication, administrator roles, schema, policies, and safe initial content.
- [x] Build branded public pages and responsive navigation using the unchanged official logo.
- [x] Build persistent application/contact forms and validated image storage.
- [x] Build administrator content management, CRUD, submission review, and secure sign-in/out.
- [x] Add metadata, sitemap, robots, and truthful structured data.
- [ ] Verify public/admin flows, persistence, permissions, and responsive layouts.
- [ ] Review security and request publishing; report access and remaining configuration.

## Verification status

- Latest automatic build: passed.
- Automated routing and form validation: 19 tests passed.
- Browser checks: all public routes, missing event, 404, administrator redirect, sitemap, validation, three successful database-backed forms, mobile menu, and layouts at 320/375/390/430/768/1024/1280/1440 pixels.
- Temporary form submissions were confirmed in the database and removed after testing.
- Fixed member email exposure, limited image reads to published content, and fixed footer hydration mismatch.
- Final public browser retest: no page errors. Basic backend security checks found no issues; deep code analysis was not included.
- Pending: approved administrator account, authenticated CRUD/image-upload/session testing, real-data search/filter/event-detail testing, recovery email flow, and published URL verification.
- There are currently no authentication users. First administrator must sign in through Google, then receive an approved administrator role; administrator rights are never granted by public signup.