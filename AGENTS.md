# Project conventions

Read PROJECT_DISCOVERY.md, DESIGN_GUIDE.md and ADMIN_REQUIREMENTS.md before changes. Preserve the surprise: never notify the business owner. Never invent business facts or inventory. Hosting is deferred.

Use TypeScript, App Router, server-side validation and Supabase RLS. Never expose service-role or Cloudinary secret keys. Public queries must read only publications; drafts are admin-only. Require verified user identity and admin membership on every write/upload. Preserve optimistic revision checks.

Do not add payments, customer accounts, tracking, or working enquiry/newsletter submissions without explicit scope changes. Use npm and commit its lockfile. Run npm run typecheck, npm test, and npm run build for substantive changes. Keep external configuration limitations explicit. No credentials in documentation or tests.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
