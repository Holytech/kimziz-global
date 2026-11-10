# Kimziz Global Links — Project Discovery

This file is the single source of truth for the website setup questionnaire and your answers. Complete the answer beneath each question. Write **Choose for me** where you want a recommendation, **TBD** for an unresolved decision, or **Not applicable** where appropriate.

Status: Initial implementation underway. Public pages, admin screens, schema and automated checks are implemented. Hosted Supabase and Cloudinary configuration will be supplied later; deployment remains deferred.

## Very Important note

- This website is a surprise gift for the business owner. Do not contact him or require answers from him during development. Use the supplied assets and the project owner's answers; record remaining assumptions explicitly.
- All changeable website content, business details, media, and vehicle inventory must be maintainable through a protected admin module without editing code.
- The initial admin will be the project owner/developer. Business-owner access can be added after the reveal; do not send invitations or notifications to him beforehand.
- Detailed admin requirements are recorded in `ADMIN_REQUIREMENTS.md`. This discovery file remains the source of truth for business answers and preferences.

## Context from the supplied assets

All six images in `guide_assets/` were reviewed. They advertise importation, exportation, logistics, car sales, and general merchandise. They show several brand identities: a blue/turquoise sailboat logo, a navy/gold globe logo, and a car-focused logo. Business details from these images require confirmation below.

## Business and website goals

### 1. Official business name

What is the official name: **Kimziz Global Links Ltd.**, **Kimziz Global**, or something else? One flyer says “Global Limited World.”

**Answer:**

Kimziz Global Links Ltd.

### 2. Active services and priorities

Which services are active today, and which should receive the most attention?

**Answer:**

in this order:

- Importation & Exportation
- Car dealings

### 3. Target customers

Who are the main customers—individual car buyers, importers, exporters, businesses, or all of these?

**Answer:**

All of these

### 4. Service coverage

Which cities, countries, and shipping routes do you serve?

**Answer:**

<!-- Write your answer here. -->

### 5. Primary visitor action

What should visitors primarily do: message on WhatsApp, request a quote, browse cars, call, or purchase?

**Answer:**

<!-- Write your answer here. -->

### 6. Differentiators and evidence

What makes the business different? Do you have verified experience, completed projects, testimonials, certifications, or partner relationships we can feature?

**Answer:**

<!-- Write your answer here. -->

## Content and pages

### 7. Website pages

Which pages do you want? Possible choices: Home, About, Services, individual service pages, Cars, Gallery, FAQs, Contact, and Blog/News.

**Answer:**

- Home
- About
- Services (all services should be listed here for now)
- Contact
- Cars

### 8. Car sales section

Should car sales be part of the main website or have a distinct section with its own visual identity?

**Answer:**

Let it be part of the website but

### 9. Confirm business details

Are these flyer details still correct: **07014615680**, **kimzizdoc@gmail.com**, **RC 1922809**, and **Office 004, second floor, Scorpio Block, Eliganza Plaza, Apapa**? Please correct the address spelling if needed.

**Answer:**

All correct

### 10. Leadership and additional business information

Should we feature **Akeem Azeez, Managing Director**? What business history, opening hours, social links, and other contact details should appear?

**Answer:**

business history, opening hours, social links and other contact details should be maintainable

### 11. Website copy and tone

Will you supply the website text, or should I draft it from confirmed business information? Should the tone be formal, approachable, premium, or conversational?

**Answer:**

Yiu are drafting every text on the website, it should be formal, approachable, premium,

### 12. Available visual assets

Do you have original logo files, real vehicle photos, office/team photos, or project images? May we use licensed stock imagery where necessary?

**Answer:**

<!-- Write your answer here. -->

### 13. Languages

Is English sufficient, or do you need other languages?

**Answer:**

Just english for now pls

## Design direction

### 14. Official logo

Which existing logo is the official one? Should it remain unchanged, be refined for web use, or be replaced?

**Answer:**

Use the blue/gold globe, K, cargo and car logo supplied on 10 November 2026. Keep the artwork unchanged and use it on the website and in social-sharing previews. Source asset: `public/brand/kimziz-logo.png`. Follow-up: remove the white background for website use; display `public/brand/kimziz-logo-transparent.png` on light and dark themes.

### 15. Colour palette

Which palette should lead: blue/turquoise, navy/gold, blue/yellow, or a new palette?

**Answer:**

navy/gold (with touches of other colours to make the website presentable and formal )

### 16. Overall visual character

What overall feel do you want: established corporate logistics, premium automotive, bold commercial, or clean and understated?

**Answer:**

All of it

### 17. Design references

Are there two or three websites you like? Tell me what you like about them—and any styles you dislike.

**Answer:**

<!-- Write your answer here. -->

### 18. Theme and typography

Do you prefer a light website, dark website, or a mixture? Any font preferences?

**Answer:**

- No font preference just something cool and readable
- light & dark theme (switchable)

### 19. Motion and media

Should motion be minimal, subtle, or prominent? Any interest in video, or should we prioritize lightweight photography?

**Answer:**

- For now let's do something subtle
- Let's have both videos and lightweight photography

### 20. Mobile and accessibility needs

Are there particular mobile requirements, accessibility needs, or older devices/browsers your customers commonly use?

**Answer:**

- It shoould be mobile responsive (mobile first) and have good visuals on desktop and laptop screens too
- It should have accessibility

## Features and customer journeys

### 21. Contact and enquiry channels

Do you want WhatsApp and phone links only, or also a working enquiry/quotation form? Where should submissions arrive?

**Answer:**

- I want the ordering button to direct user to whatsapp with the details of order
- Enquiry/quotation form should not be connected for now pending the time I decide where it should be sent to

### 22. Quotation requirements

For quotes, what information do you need—service, origin/destination, cargo details, budget, vehicle preferences, or document uploads?

**Answer:**

All

### 23. Vehicle inventory

For cars, do you need searchable listings, filters, prices, photo galleries, availability labels, and individual vehicle pages? Who will update inventory?

**Answer:**

Inventory is to be update from the admin dashboard.

### 24. Payments

Will the website accept payments or deposits? If yes, for what, and in which currencies?

**Answer:**

For now, website does not accept payment

### 25. Tracking, accounts, and bookings

Do you need shipment tracking, customer accounts, bookings, or a customer portal? If tracking is required, what system currently holds shipment updates?

**Answer:**

For now, NO. In the future we might decide to add it.

### 26. Administration and content editing

Do you need an admin dashboard or content editor? Who will use it, and what should they be able to change?

**Answer:**

Yes, we do need an admin dashboard.

Confirmed scope: manage website content, business details, media, and vehicle inventory. Include protected sign-in, draft/preview/publish controls, and inventory availability management. See `ADMIN_REQUIREMENTS.md` for the implementation scope and acceptance criteria.

### 27. Integrations

Any integrations with existing email, CRM, inventory, shipping, newsletter, or other business tools?

**Answer:**

Newsletter should be dummy for now, until I decide where to sent it to. Inventory is going to be managed from the admin dashboard

## Development, hosting, and ownership

### 28. Technology preferences

Do you have a preferred framework, styling system, package manager, or backend—or should I select these after we settle the features?

**Answer:**

- Next JS (fullstack capacity)
- TailwindCSS
- lucide dev
- Motion for animation
- supabase (db)
- Clooudinary for file storage (image, pdf, doc etc.)

### 29. Domain and hosting

Do you already own a domain and hosting? Who manages them, and do you have a preferred deployment provider?

**Answer:**

Leave out this part for now, it most likely will be hosted on vercel for now

### 30. Source repository

Should we set up a GitHub repository? If one exists, which repository should this project use?

**Answer:**

this is the repo: https://github.com/Holytech/kimziz-global.git

### 31. Operating budget

What monthly budget is available for hosting, email delivery, storage, and other services? Are paid services acceptable?

**Answer:**

I don't have a domain yet, if we can find a email delivery service that would not require payment or custom domain, then go on.

### 32. Analytics and search visibility

Do you want visitor analytics, enquiry conversion tracking, search-engine setup, or advertising pixels?

**Answer:**

- visitor analytics
- enquiry conversion tracking
- search-engine setup

### 33. Policies and customer data

Do you have existing privacy, terms, refund, or shipping policies? If customer information is collected, who should access it and how long should it be retained?

**Answer:**

<!-- Write your answer here. -->

### 34. Maintenance and development workflow

Who will maintain the website after launch? Do you want automated checks and preview deployments for future changes?

**Answer:**

I will be maintaining the website, but if there are things to make it easy like the automated checks and preview deployments go on and implement

### 35. Launch timing and scope

What is the target launch date, what must be included at launch, and what can wait?

**Answer:**

the basic user features must be launch, but the online payment for cars can wait

## Additional notes

Use this space for requirements, constraints, or preferences not covered above.

<!-- Write additional notes here. -->

## Documentation and setup deliverables

The initial implementation now includes the documentation and setup below. See README.md for configuration instructions, verification coverage, and remaining work:

- `DESIGN_GUIDE.md` — branding, typography, colours, spacing, responsive layouts, components, imagery, motion, and accessibility.
- `PROJECT_BRIEF.md` — audience, goals, pages, features, content, and launch scope.
- `README.md` — installation, development, checks, deployment, and maintenance.
- `AGENTS.md` — project conventions for future coding work.
- Appropriate framework configuration, dependency lockfile, `.gitignore`, `.editorconfig`, environment-variable template, formatting/check tooling, and deployment configuration.
- SEO assets and configuration, including metadata, sitemap, robots rules, favicons, and social-sharing images.

The exact setup files will follow the chosen stack and features. Unanswered factual questions remain unknown. For this surprise project, use clearly documented, reversible implementation assumptions; do not invent business history, service coverage, testimonials, certifications, opening hours, or real inventory.
