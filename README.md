# Kimziz Global Links

A Next.js website and protected content/inventory dashboard. This is a surprise project: do not contact or invite the business owner during setup or testing. Deployment is deferred.

## Local development

Requires Node.js 22+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000. The public site runs with starter content and an empty vehicle catalogue without external configuration. `/admin` redirects to the setup-aware sign-in page until Supabase is configured. No mock login or local-storage CMS is used.

```sh
npm run typecheck
npm test
npm run build
npm start
```

`npm test` runs model validation and real Postgres semantics using PGlite: private drafts, unauthorized writes, public snapshots, publication changes, revision conflicts, and revoked administrator access. It does not contact hosted services. `npm run format` formats source and documentation.

## Connect Supabase later

Use a new, dedicated Kimziz project. Do not apply this schema to unrelated connected projects.

1. Add the project URL and publishable key to `.env.local` using the names in `.env.example`. No service-role key is required by this app.
2. `supabase/schemas/001_content.sql` is the reviewed declarative schema source. For a new empty hosted project, run its contents once in the Supabase SQL editor. For a CLI-managed environment, initialize the CLI configuration, configure `db.migrations.schema_paths = ["./schemas/*.sql"]`, generate and review a migration from the declarative source, then apply it to the intended project. Never re-run the initial create statements against an already initialized database.
3. Disable public sign-ups in Supabase Auth. Create the developer's administrator account directly through the dashboard with a password. Use the developer's email and do not send an invitation to the business owner. Do not place passwords in repository files.
4. Copy that account's UUID and explicitly grant membership using the SQL editor:

```sql
insert into public.admins (user_id)
values ('REPLACE_WITH_DEVELOPER_AUTH_USER_UUID');
```

5. Restart the dev server, sign in at `/admin/login`, and publish the initial website content. Draft saves are private and do not alter public content.
6. Verify live sign-in, persistence, refresh, sign-out, access denial for an ordinary account, and publication visibility before deploying.

The app verifies the session server-side with `getUser()` and checks `admins` membership on reads and writes. RLS also enforces permissions in Postgres. `admins` cannot be modified by browser roles. Public readers only access `publications`; unpublished JSON lives in `documents`. The `save_document` function uses invoker rights and revision matching; a stale save fails atomically.

References: [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [declarative schemas](https://supabase.com/docs/guides/local-development/declarative-database-schemas).

## Cloudinary

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` on the server. Restart development after changing environment variables. The secret is never sent to the browser.

The authenticated upload endpoint validates origin, admin membership, file size and detected file type before streaming to Cloudinary. Uploads are limited to 4 MB to fit ordinary serverless request limits. Supported files: JPEG, PNG, WebP, MP4, PDF and DOCX. Larger videos can be uploaded through Cloudinary directly and their HTTPS URLs added to content. Videos have controls and no autoplay.

The media library contains public marketing assets only. Do not upload customer or confidential documents. Uploads are recorded in the private admin media index; the delivered Cloudinary URLs themselves are public. If database registration fails, the endpoint attempts to remove the uploaded asset. Verify upload and metadata persistence against the real service before release.

Media can be uploaded, viewed, copied into fields, and reordered/removed from vehicle galleries. Permanent asset deletion is intentionally unavailable, preventing accidental deletion of referenced images. Asset metadata editing and reference-aware deletion are follow-up work.

Reference: [Cloudinary Node uploads](https://cloudinary.com/documentation/node_image_and_video_upload).

## Content workflow

- `/admin/content`: business details, homepage, About copy, page headings, navigation labels, CTA/footer text, services, social links, site SEO and media URLs.
- `/admin/inventory`: searchable inventory, publication/availability filters, new vehicles and edits.
- `/admin/media`: public image/video/document uploads and asset URLs.
- Save draft → open private preview → publish. Preview shows the last saved version, not unsaved browser changes.
- Availability is separate from publication: available/reserved/sold vehicles can remain published; archive/unpublish removes a listing from public browsing while retaining its editable draft.
- Concurrent edits are protected by an optimistic revision check. If another save occurred, copy your unsaved work before reloading.
- No actual cars are seeded. Incomplete or fabricated stock must not be published.

Some presentational helper text and interface labels remain in components. Business content is editable; a full freeform page builder is not included. FAQs/policies, per-page SEO overrides, richer media organization, and role management UI remain future extensions.

## Appearance and assets

Read `DESIGN_GUIDE.md`. Navy/gold, mobile-first layouts, light/dark mode, keyboard focus and reduced-motion support. The temporary text wordmark and code-native trade illustration avoid presenting an unconfirmed logo or stock image as a business-owned asset. The supplied flyers remain in `guide_assets/` for reference. Logo refinement is pending identification of the correct source image.

## Search visibility, analytics and release

`NEXT_PUBLIC_ALLOW_INDEXING=false` is the default for the surprise preview. Robots metadata and robots.txt discourage indexing; this is not a password gate. Keep hosting private or local before the reveal.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain and enable indexing only when publication is intended. The app generates robots.txt, a sitemap for public pages/vehicles, a favicon and a default social image. Edit site SEO text and override the social image through admin.

Vercel Analytics and the `whatsapp_enquiry_click` event are opt-in through `NEXT_PUBLIC_ENABLE_ANALYTICS=true`. A click measures opening an enquiry, not a sent message or sale. Both remain disabled locally. Confirm account support and any costs before enabling analytics. There is no connected email/newsletter provider and no dummy submission success.

GitHub Actions runs type checking, tests and a production build. Vercel deployment/PR previews can be enabled when the repository is connected to Vercel; no external repository or deployment configuration has been changed. Add environment variables per environment and protect preview deployments before sharing.

## Handover checks still requiring service configuration

- Live Supabase sign-in, session refresh, persistence and authorization smoke tests.
- Cloudinary uploads, file delivery and database registration.
- Seed/publish verified content and real stock; confirm logo and media rights.
- Review any policy text before collecting visitor information.
- Enable analytics and indexing only at the intended release stage.
- Check public accessibility, phone/WhatsApp destinations and the final domain without sending test enquiries to the owner.

## Verification record — 10 November 2026

- Production build and TypeScript checks passed.
- All 11 model, Postgres access/publication, and request-origin tests passed.
- Browser checks: Home, About, Services, Cars and Contact returned HTTP 200 with one primary heading and no horizontal overflow at a 390px viewport.
- Mobile menu navigation, empty-catalogue search, persisted theme switching, and disabled unconfigured sign-in were exercised.
- Upload endpoint returned 401 for an unauthenticated same-origin request and 403 for a cross-origin request. No message was sent to the business owner.
- Screenshots are saved locally under `output/playwright/` (ignored by Git).
- Live hosted sign-in, actual content writes and media delivery remain unverified until configuration is supplied. The SQL behaviour was verified locally using PGlite, not against a hosted Supabase instance.
