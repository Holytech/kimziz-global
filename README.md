# Kimziz Global Links

A modern Next.js website, vehicle catalogue, and protected content management dashboard for **Kimziz Global Links Ltd.** (RC 1922809), an Apapa, Lagos-based firm specialising in international trade (importation and exportation) and automotive dealings.

> [!IMPORTANT]
> **Surprise Project Mandate**: This platform is being developed as a surprise gift for the Managing Director, **Akeem Azeez**.
>
> - **Never contact, message, or notify the business owner** during development, testing, or preview stages.
> - **Do not trigger real enquiries** to his WhatsApp or phone number during testing.
> - **Do not invite or register his email** in Supabase Auth until the formal handover after the reveal.
> - **Never invent business facts, statistics, customer testimonials, or fake vehicle stock.** Any unverified business information must remain unpublished.

---

## Table of Contents

1. [Project Overview & Scope](#project-overview--scope)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Key Features & User Journeys](#key-features--user-journeys)
4. [Security & Data Integrity Architecture](#security--data-integrity-architecture)
5. [Local Development & Quick Start](#local-development--quick-start)
6. [External Service Configuration](#external-service-configuration)
   - [1. Supabase Setup (Database & Auth)](#1-supabase-setup-database--auth)
   - [2. Cloudinary Setup (Media Storage)](#2-cloudinary-setup-media-storage)
7. [Brand & Design Guidelines](#brand--design-guidelines)
8. [SEO, Structured Data & Analytics](#seo-structured-data--analytics)
9. [Automated Testing & CI](#automated-testing--ci)
10. [Pre-Launch & Handover Checklist](#pre-launch--handover-checklist)
11. [Project Directory Structure](#project-directory-structure)

---

## Project Overview & Scope

Kimziz Global Links Ltd. operates across two core commercial verticals:

1. **Importation & Exportation (Primary priority)**: Connecting Nigerian businesses to international trade routes, customs clearing, and cargo logistics.
2. **Car Dealings (Secondary priority)**: Retail and sourcing of foreign-used, Nigerian-used, and brand-new vehicles.
3. **General Merchandise & Logistics**: Sourcing, distribution, and general supply chains.

### Business Details

- **Entity**: Kimziz Global Links Ltd.
- **Registration**: RC 1922809
- **Head Office**: Office 004, 2nd Floor, Scorpio Block, Eleganza Plaza, Apapa, Lagos, Nigeria
- **Leadership**: Akeem Azeez, Managing Director
- **Direct Phone**: `07014615680`
- **WhatsApp**: `2347014615680`
- **Email**: `kimzizdoc@gmail.com`

### Explicit Scope Boundaries

- **No Online Payments**: The website does not collect card payments or bank deposits for vehicles or shipping.
- **No Customer Accounts / Shipment Tracking**: Customer portals, user sign-ups, and live tracking are excluded from the current scope.
- **WhatsApp-First Ordering**: Product and vehicle enquiries open direct WhatsApp chats with listing details pre-populated in the draft message.
- **Unconnected Contact/Newsletter Forms**: General enquiry and newsletter forms are intentionally unlinked placeholders until a dedicated email delivery provider is selected. They never claim false submission success or collect visitor data unhandled.
- **Hosting is Deferred**: Vercel-ready architecture, but deployment remains local and unindexed until the surprise reveal.

---

## Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type checking)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/) (subtle transitions), [Lucide React](https://lucide.dev/) icons
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL 15+, Row Level Security, `@supabase/ssr` server-side session management)
- **Media Storage**: [Cloudinary](https://cloudinary.com/) (Authenticated server uploads up to 25 MB, media library management)
- **Validation**: [Zod v4](https://zod.dev/) (Server-side schema validation for all site content and vehicle models)
- **Testing**: [Node.js Native Test Runner](https://nodejs.org/api/test.html) via `tsx`, [@electric-sql/pglite](https://github.com/electric-sql/pglite) (In-memory Postgres executing the real declarative schema and RLS policies locally)
- **Package Manager**: `npm` (strictly commit `package-lock.json`)

---

## Key Features & User Journeys

### 1. Public Experience

- **Home (`/`)**: Hero section featuring code-native trade artwork (`TradeArt`), company intro, primary trade services, featured car listings showcase, and primary call to action.
- **About (`/about`)**: Company background, mission, leadership details (Akeem Azeez, MD), and Apapa maritime trade positioning.
- **Services (`/services`)**: Full service breakdown (Importation, Exportation, Car Dealings, General Merchandise) with structured process steps.
- **Vehicle Catalogue (`/cars`)**:
  - Filterable by make/brand, vehicle condition (`Foreign used`, `Nigerian used`, `New`), and price range slider (via `useCarsFilter`).
  - Search by make, model, year, or description keyword.
  - Graceful handling of unpriced cars ("Price on request").
- **Vehicle Details (`/cars/[id]`)**:
  - Rich image gallery with full-screen interactive **Lightbox** modal preview.
  - Embedded video walkaround (Cloudinary or HTTPS stream).
  - Specifications table (Year, Mileage, Transmission, Fuel, Condition, Location).
  - One-click **"Enquire on WhatsApp"** button generating a contextual enquiry message with car title and reference.
- **Contact (`/contact`)**:
  - Direct call and WhatsApp action buttons.
  - Physical office location at Eleganza Plaza, Apapa.
  - Working hours and clear contact details.

### 2. Admin Workspace (`/admin`)

- **Setup-Aware Sign-In (`/admin/login`)**: Automatically detects whether Supabase is configured; disables fake mock logins. Enforces server-side credentials and administrator table membership.
- **Content Editor (`/admin/content`)**: Complete control over global business settings, phone/WhatsApp numbers, address, homepage headlines, about text, service cards, navigation labels, and default SEO tags.
- **Inventory Management (`/admin/inventory`)**: Searchable vehicle index with status filters (availability and publication state), quick navigation, and listing management.
- **Vehicle Editor (`/admin/inventory/[id]`)**:
  - Comprehensive spec fields, condition, transmission, and pricing controls (supports NGN, USD, GBP, EUR or "Price on Request").
  - **Gallery Manager**: Drag/reorder photos, set image cover thumbnail, configure accessibility alt text, and stage batch uploads.
  - **Video Manager**: Manage walkaround video URLs or upload directly to Cloudinary.
  - **Availability Lifecycle**: Mark cars as `available`, `reserved`, or `sold`.
- **Media Library (`/admin/media`)**:
  - Centralized Cloudinary asset explorer with search and file-type filters.
  - Secure uploads up to 25 MB with automatic folder scoping (`kimziz/`).
  - Full-screen lightbox preview, one-click asset URL copying, and asset deletion.
- **Live Preview (`/admin/preview/[id]`)**: Allows administrators to preview private drafts within the exact public layout before publishing live.
- **Concurrency & Revision Guards**:
  - Optimistic locking prevents silent overwrites if multiple edits occur simultaneously.
  - Client-side navigation guards warn when navigating away from unsaved drafts or gallery changes.

---

## Security & Data Integrity Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Public Visitors                      │
└──────────────────────────┬─────────────────────────────┘
                           │ Reads ONLY
                           ▼
               ┌────────────────────────┐
               │  public.publications   │ (Public snapshots)
               └────────────────────────┘
                           ▲
                           │ Atomic publish / unpublish via
                           │ save_document() stored procedure
                           │ (Verifies admin membership & revision)
                           ▼
               ┌────────────────────────┐
               │    public.documents    │ (Private drafts & revisions)
               └────────────────────────┘
                           ▲
                           │ Reads & writes ONLY by
                           │ verified administrators
┌──────────────────────────┴─────────────────────────────┐
│                 Authenticated Admin                    │
│      (auth.users matching public.admins table)         │
└────────────────────────────────────────────────────────┘
```

1. **Strict Draft vs. Publication Isolation**:
   - The public website reads exclusively from `public.publications`. Unauthenticated visitors can never access unpublished drafts or draft revisions.
   - Unpublished edits live in `public.documents` as private JSONB drafts.
2. **Postgres Row Level Security (RLS)**:
   - RLS is enabled on all tables (`admins`, `documents`, `publications`, `media`).
   - Browser / anon roles have `SELECT` on `publications` only. All other tables revoke direct public access.
3. **Atomic Concurrency Protection**:
   - Updates are transacted through the Postgres function `save_document(p_id, p_kind, p_data, p_revision, p_action)`.
   - The function checks the user's presence in `public.admins`, validates the expected revision number, bumps the revision, updates the draft, and conditionally snapshots into `public.publications`.
   - Stale saves fail atomically without corrupting data.
4. **Request & Origin Validation**:
   - All admin mutation actions and upload endpoints verify origin headers using `sameOrigin()` against `Host` / `X-Forwarded-Host` to block CSRF.
5. **Zero Secret Leakage**:
   - Supabase service-role keys are not used by the application.
   - `CLOUDINARY_API_SECRET` is strictly server-only and never exposed to the client bundle.
6. **Input Sanitization & Safe URLs**:
   - Server-side Zod validation rejects invalid links, disallows dangerous protocols (`javascript:`, `data:`), and enforces safe HTTPS / relative paths.
   - JSON-LD structured data is serialized safely to prevent script-injection attacks.

---

## Local Development & Quick Start

### Prerequisites

- **Node.js**: `22.0.0` or higher
- **npm**: `10.0.0` or higher

### Installation & Setup

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Holytech/kimziz-global.git
   cd kimziz-global
   ```

2. **Install dependencies**:

   ```sh
   npm ci
   ```

3. **Initialize local environment**:

   ```sh
   cp .env.example .env.local
   ```

4. **Start the development server**:

   ```sh
   npm run dev
   ```

5. **Open the browser**:
   - Public Website: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

> [!NOTE]
> **Default Offline Behavior**: When `.env.local` contains empty Supabase variables, the public site runs gracefully using built-in starter content and an empty car catalogue. Visiting `/admin` displays a helpful configuration screen instructing the developer to connect Supabase. No fake mock login or browser local-storage database is used.

### Available Scripts

| Command             | Description                                                             |
| :------------------ | :---------------------------------------------------------------------- |
| `npm run dev`       | Starts the Next.js development server on port 3000                      |
| `npm run typecheck` | Executes TypeScript type checking (`tsc --noEmit`)                      |
| `npm test`          | Runs the test suite (Postgres RLS, SEO, catalogue, models) using PGlite |
| `npm run build`     | Compiles the production build                                           |
| `npm start`         | Runs the compiled production server                                     |
| `npm run format`    | Formats all code and markdown using Prettier                            |

---

## External Service Configuration

### 1. Supabase Setup (Database & Auth)

Use a **new, dedicated Supabase project** for Kimziz Global Links. Never reuse or run these migrations on unrelated databases.

#### Step 1: Configure Environment Variables

In `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
```

#### Step 2: Apply the Declarative Database Schema

1. Open your Supabase Dashboard and navigate to the **SQL Editor**.
2. Open the file `supabase/schemas/001_content.sql` in this repo.
3. Paste its contents into the SQL Editor and execute it. (The schema configures tables, RLS policies, administrator access checks, media management permissions including deletion, and optimistic concurrency functions).

#### Step 3: Configure Supabase Authentication

1. Go to **Authentication** -> **Providers** -> **Email**.
2. Ensure Email provider is enabled.
3. In **Authentication** -> **Configuration** (or User Signups):
   - **Disable "Allow new users to sign up"** (ensures only manually created admin users can exist).
4. Create the initial administrator user:
   - Go to **Authentication** -> **Users**.
   - Click **Add User** -> **Create User**.
   - Enter your developer email and a secure password.
   - Check **Auto Confirm User?** to bypass email confirmation.
   - **Do NOT use the business owner's email address or send him invitations.**

#### Step 4: Grant Admin Privileges

Copy the newly created User UUID from the Supabase Users table, then run this query in the SQL Editor:

```sql
insert into public.admins (user_id)
values ('PASTE_YOUR_USER_UUID_HERE');
```

#### Step 5: Test Admin Sign-In & Content Publishing

1. Restart your development server (`npm run dev`).
2. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
3. Log in with your admin credentials.
4. Open `/admin/content` and click **Publish**. This creates the initial public snapshot in `public.publications`.

---

### 2. Cloudinary Setup (Media Storage)

Cloudinary powers the media library, vehicle photo galleries, and video storage.

#### Step 1: Configure Credentials

Obtain your credentials from the Cloudinary Console and add them to `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Step 2: Verification & Limits

- **Max File Size**: 25 MB per upload.
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`, `video/mp4`, `video/quicktime` (.mov), `video/webm`, `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
- **Target Folder**: Assets are automatically scoped under the `kimziz/` directory in Cloudinary (e.g. `kimziz/vehicles/<reference>`).
- **Safety**: The upload endpoint validates file magic bytes via `file-type` on the server before streaming to Cloudinary. Unauthenticated or non-admin requests are rejected with 401/403.

---

## Brand & Design Guidelines

Read `DESIGN_GUIDE.md` for complete design token specifications.

### Color Palette

- **Navy (Primary Brand)**: `#0c2035`
- **Deep Navy (Backgrounds/Borders)**: `#081725`
- **Warm Gold (Accents & CTAs)**: `#dfb566` (Hover: `#edca8b`) — _Gold buttons always use navy text._
- **Paper / Light Background**: `#f7f5ef`
- **Dark Surface Backgrounds**: `#0b1928` and `#11283d`
- **Body Text Ink**: `#10283d` (Light text: `#f4f2ed`)

### Typography & Spacing

- **Font Stack**: System sans-serif (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`). No external Google Fonts dependencies to guarantee instant zero-layout-shift rendering.
- **Tracking & Leading**: Tight tracking on headings; `1.65` line-height on body prose.
- **Spacing Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px. Max content width: `1240px`.

### Logo & Graphic Assets

- **Approved Logo**: The official blue/gold globe, K, cargo and car emblem is stored in `public/brand/kimziz-logo.png`.
- **Transparent Web Variant**: `public/brand/kimziz-logo-transparent.png` is used across website headers, footers, and cards for seamless light and dark surface integration.
- **Trade Artwork**: The hero section uses a code-native responsive SVG trade graphic (`TradeArt`) illustrating global shipping lanes and maritime routes.
- **Reference Flyers**: Historical marketing flyers are preserved in `guide_assets/` for historical context.

### Responsive & Accessibility Standards

- **Mobile First**: Clean responsive rendering down to 360px viewport with zero horizontal overflow.
- **Touch Targets**: Minimum 44px on interactive controls.
- **Theme Switcher**: Smooth switch between light and dark themes; persists in `localStorage` and defaults to system `prefers-color-scheme`.
- **Accessible Motion**: Respects `prefers-reduced-motion`. Video elements have native controls and never autoplay with sound.

---

## SEO, Structured Data & Analytics

### Search Engine Visibility

- **Surprise Preview Default**: `NEXT_PUBLIC_ALLOW_INDEXING=false` in `.env.local` sets `robots.txt` and meta tags to `noindex, nofollow` to prevent search crawlers from discovering the project before the surprise reveal.
- **Production URL**: When ready for release, set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` and `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- **Sitemap & Robots**:
  - Dynamic sitemap generated at `/sitemap.xml` covering public pages and published vehicle listing URLs.
  - Dynamic crawler directives generated at `/robots.txt`.

### Structured Data (JSON-LD)

All public pages emit Schema.org JSON-LD graph objects:

- `WebSite`: Name, URL, description, and search metadata.
- `Organization` / `LocalBusiness` / `AutoDealer`: Official business name, Apapa address, registration number (`RC 1922809`), contact numbers, and logo.
- Individual vehicle pages emit search-friendly metadata tags.

### Privacy-Preserving Analytics

- Analytics are opt-in via `NEXT_PUBLIC_ENABLE_ANALYTICS=true` using `@vercel/analytics`.
- Tracks key interaction events such as `whatsapp_enquiry_click`.
- Note: A click measures intent to chat, not a completed delivery or sale.

---

## Automated Testing & CI

The repository includes a comprehensive automated test suite running with Node.js native test runner and `tsx`:

```sh
npm test
```

### Test Coverage (`tests/` directory)

1. **Postgres RLS & Concurrency (`tests/content.test.ts`)**:
   - Executes the real `001_content.sql` schema inside an in-memory PGlite Postgres instance.
   - Verifies that unauthenticated visitors cannot read private drafts.
   - Verifies that non-admin authenticated users cannot modify content or self-promote.
   - Verifies atomic snapshot creation upon publishing.
   - Tests optimistic locking: stale revisions fail atomically.
   - Verifies that archiving vehicles removes public visibility while preserving drafts.
   - Tests origin security checks rejecting cross-site forgery attempts.
2. **SEO & Structured Data (`tests/seo.test.ts`)**:
   - Verifies Open Graph, Twitter cards, viewport, canonical links, and theme color tags.
   - Tests dynamic metadata generation for individual vehicle pages.
   - Verifies Schema.org JSON-LD graph formatting.
3. **Vehicle Catalogue & Filtering (`tests/catalogue.test.ts`)**:
   - Tests `useCarsFilter` hook logic (brand extraction, price bounds, search queries).
   - Validates catalogue UI rendering with and without numeric price ranges.
4. **UI Components (`tests/dropdown.test.ts`)**:
   - Verifies accessible dropdown select behaviors and screen-reader label associations.

### Continuous Integration (GitHub Actions)

`.github/workflows/checks.yml` automatically triggers on all pushes and pull requests to run:

```sh
npm ci
npm run typecheck
npm test
npm run build
```

---

## Pre-Launch & Handover Checklist

Before presenting the platform to the business owner, complete the following verification steps:

- [ ] **Run All Automated Checks**:
  ```sh
  npm run typecheck && npm test && npm run build
  ```
- [ ] **Supabase Production Smoke Test**:
  - Sign in at `/admin/login`.
  - Edit business contact details and verify changes persist after refresh and browser restart.
  - Publish content and verify it immediately updates on public routes without code deployment.
  - Test session expiration and sign-out.
- [ ] **Cloudinary Media Upload Verification**:
  - Upload a test photo and a test walkaround video in `/admin/media`.
  - Verify Cloudinary delivery URLs load securely over HTTPS.
  - Delete test assets and verify removal from both Cloudinary and Supabase `media` table.
- [ ] **Inventory & WhatsApp Enquiry Smoke Test**:
  - Create a vehicle draft, add specs, and upload photo gallery.
  - Test the private preview at `/admin/preview/[id]`.
  - Publish the vehicle and test filtering on `/cars`.
  - Click "Enquire on WhatsApp" on `/cars/[id]` and verify the destination number is `2347014615680` and the pre-filled text includes the vehicle title and reference. _(Do not click 'Send' in WhatsApp until the reveal)._
- [ ] **Domain & Indexing Transition**:
  - When assigning the production domain, set `NEXT_PUBLIC_SITE_URL=https://www.kimzizglobal.com`.
  - Switch `NEXT_PUBLIC_ALLOW_INDEXING=true`.
  - Enable `NEXT_PUBLIC_ENABLE_ANALYTICS=true` if Vercel Analytics is active.
- [ ] **Business Owner Handover (Post-Reveal)**:
  - Create an administrator account for Akeem Azeez in Supabase Auth.
  - Insert his user UUID into `public.admins`.
  - Provide him with his login credentials and walkthrough of `/admin`.

---

## Project Directory Structure

```
kimziz-global/
├── .github/
│   ├── workflows/checks.yml      # CI workflow (typecheck, test, build)
│   └── PULL_REQUEST_TEMPLATE.md  # Standardized PR template
├── guide_assets/                 # Original marketing flyer references
├── public/                       # Static public assets
│   ├── brand/                    # Official Kimziz logos (PNG, transparent)
│   └── icon.svg                  # Favicon SVG
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Public routes (Home, About, Services, Cars, Contact)
│   │   │   ├── about/
│   │   │   ├── cars/             # /cars and /cars/[id]
│   │   │   ├── contact/
│   │   │   ├── services/
│   │   │   └── page.tsx          # Homepage
│   │   ├── admin/                # Protected admin workspace
│   │   │   ├── (workspace)/      # Dashboard, /content, /inventory, /media
│   │   │   ├── login/            # Setup-aware admin sign-in
│   │   │   ├── preview/[id]/     # Draft live preview
│   │   │   └── actions.ts        # Admin Server Actions (save, publish, auth)
│   │   ├── api/admin/upload/     # Secure Cloudinary file upload & deletion API
│   │   ├── globals.css           # Global Tailwind CSS styles
│   │   ├── layout.tsx            # Root layout with theme provider & SEO
│   │   ├── robots.ts             # Dynamic robots.txt
│   │   └── sitemap.ts            # Dynamic sitemap.xml
│   ├── components/               # React components
│   │   ├── dropdown.tsx          # Accessible custom select component
│   │   ├── lightbox/             # Fullscreen image/video lightbox modal
│   │   ├── modal.tsx             # Reusable accessible dialog modal
│   │   ├── public/               # Modular public page components
│   │   │   ├── about/            # Story, mission, leadership
│   │   │   ├── cars/             # Catalogue, vehicle detail, gallery, specs
│   │   │   ├── common/           # Vehicle card, service row, CTA, badges
│   │   │   ├── contact/          # Details, panels, office info
│   │   │   ├── home/             # Hero, video, vehicles strip
│   │   │   └── services/         # Services content & process steps
│   │   ├── shell.tsx             # Header, navigation, theme toggle, footer
│   │   ├── trade-art/            # Code-native maritime & trade vector graphic
│   │   ├── vehicle-editor.tsx    # Vehicle CRUD editor form
│   │   ├── vehicle-gallery-manager.tsx # Gallery upload, reorder, cover manager
│   │   └── vehicle-video-manager.tsx   # Video upload & embed manager
│   ├── hooks/
│   │   └── cars/use-cars-filter.ts # Filtering, price calculations & brand extraction
│   └── lib/                      # Core business logic & utilities
│       ├── data.ts               # Server data loaders (React cache)
│       ├── defaults.ts           # Honest starter content fallbacks
│       ├── model.ts              # Zod validation schemas & types
│       ├── request-security.ts   # Origin validation & CSRF guards
│       ├── seo.ts                # Metadata & JSON-LD generators
│       └── supabase.ts           # Server-side Supabase clients & auth guards
├── supabase/
│   └── schemas/001_content.sql   # Declarative PostgreSQL schema & RLS policies
├── tests/                        # Automated test suite (PGlite, SEO, components)
├── .env.example                  # Environment variable reference
├── AGENTS.md                     # Agent development rules and constraints
├── DESIGN_GUIDE.md               # Detailed visual design specification
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript compiler configuration
```
