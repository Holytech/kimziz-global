# Admin Requirements

Status: Initial implementation written. Database authorization and publishing are covered by local Postgres tests; live sign-in, persistence and uploads require service configuration. See README.md for current coverage and remaining extensions.

Source: `PROJECT_DISCOVERY.md` and the project owner's request for editable content and inventory. Business answers in the discovery file take precedence. The defaults below are proposed implementation choices that can be revised during development.

## Purpose and surprise constraint

Provide a protected admin dashboard so routine content and inventory updates do not require code changes. The project owner/developer will manage the initial setup. Do not contact, invite, or notify the business owner before the reveal. Missing business facts must not block preparation: leave them unpublished until known.

## Access

- Require sign-in for the admin dashboard and authorization for every protected read, write, and upload operation.
- No public administrator registration. Provision the initial administrator explicitly; allow a later handover to the business owner.
- Keep credentials and privileged keys out of browser code and tracked files.
- Handle expired sessions, unauthorized requests, and failed saves clearly.
- Keep admin pages out of public navigation and search indexing. Hidden URLs are not an access-control mechanism.

## Editable content

- Global settings: business name, logo, contact numbers, WhatsApp number, email, address, registration number, social links, and opening hours.
- Home: headline, supporting copy, calls to action, media, featured services, and featured vehicles.
- About: introduction, business history, leadership, and supporting media. Unknown information stays hidden.
- Services: title, summary, description, media, display order, and visibility. Importation/exportation leads, followed by car dealings, as specified in discovery.
- Contact: contact details, map link if available, and explanatory text.
- Shared content: navigation labels, footer text, FAQs if enabled, and policy content when available.
- SEO: page titles, descriptions, and social-sharing images.
- Use structured fields and controlled sections so editing preserves responsive layouts and accessibility. A freeform page builder is outside the initial scope.

## Vehicle inventory

- Create, edit, preview, publish, unpublish, and archive vehicles.
- Fields: listing title, stable listing reference, make, model, year, condition, mileage and unit, transmission, fuel type, colour, description, features, and location where known.
- Pricing: amount, currency, or an explicit “Price on request” setting. Never turn a missing price into zero.
- Media: cover image, ordered gallery, descriptive alternative text, and optional video.
- Availability: available, reserved, or sold, separate from publication status.
- Control featured placement and display order.
- Support admin search and filters by publication status and availability.
- Public car browsing should support search, useful filters, galleries, availability labels, and vehicle detail pages as a working default.
- Vehicle enquiries open WhatsApp with the listing title, reference, and link. The visitor reviews and sends the message; a click does not create a paid or confirmed order.
- Sold/reserved listings must clearly show their status and avoid suggesting immediate availability.
- No fabricated stock. Demo vehicles, if needed for a private preview, must be labelled and excluded from public publication.

## Media management

- Upload, select, replace, and organize images, videos, and supported documents.
- Store descriptive titles and image alternative text; validate file types and sizes.
- Show upload progress and actionable errors.
- Warn before deleting media referenced by published content. Prefer archive/unpublish for content removal, with confirmation for permanent deletion.
- Public marketing assets and any future private customer documents need separate access rules. Customer document collection is deferred with the unconnected enquiry form.

## Publishing and editing behaviour

- Save drafts without changing the live site; preview drafts only through authorized access.
- Publish deliberately and show success only after persistence succeeds.
- Support section visibility and empty states so unfinished content can remain hidden.
- Record who last updated content and when. Warn about unsaved changes and prevent silent overwrites when a newer edit exists.
- Validate required fields and links on the server as well as in the editor.
- Published changes must appear on the public site after the applicable cache refresh, without a code deployment.
- Keep layout, executable code, credentials, and infrastructure configuration outside the content editor.

## Deferred integrations

- No online payments, customer accounts, shipment tracking, or customer portal at launch.
- Enquiry/quotation and newsletter submissions remain unconnected, as requested. Hide them or clearly mark them unavailable; never display a false submission success or silently collect personal data.
- Use WhatsApp as the working enquiry path. Do not send business-owner messages during testing.
- Future form delivery settings should not expose secrets through ordinary content fields.

## Unknown facts and working assumptions

- Do not invent service routes, founding dates, performance statistics, testimonials, partnerships, or opening hours.
- Cars remain within the main website. The unfinished answer to question 8 does not establish a separate car brand.
- Navy/gold, switchable light/dark themes, subtle motion, mobile-first layouts, and accessible controls follow the discovery answers.
- The user approved the blue/gold globe, K, cargo and car logo on 10 November 2026, saved in `public/brand/kimziz-logo.png`.
- Media rights, policy wording, and actual inventory need evidence before publication. Keep unsupported material out of the live site.

## Acceptance criteria

- An authorized admin can update business contact details and publish them without changing code.
- An authorized admin can draft a vehicle, add and reorder images, preview it, publish it, change its availability, and archive it.
- Drafts and private previews are inaccessible to unauthenticated visitors, including through direct data requests.
- Unauthorized users cannot modify content, inventory, or media by calling backend endpoints directly.
- Edits survive refresh and sign-out; failed saves preserve the editor's input and show an error.
- Public vehicle details and WhatsApp enquiry text reflect the selected published listing.
- Admin forms work on mobile and with keyboard navigation, clear labels, focus indicators, and accessible error messages.
- No unconnected form claims to have sent a message, and no setup or testing action alerts the business owner.
