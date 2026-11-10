# Kimziz design guide

## Direction

A composed, editorial business website with import/export first and automotive second. Navy establishes the identity; warm gold marks actions and key details. Use generous whitespace, strong typography, fine rules, and numbered service rows. Avoid invented statistics and customer endorsements.

## Tokens

- Navy: #0c2035; deep navy: #081725.
- Gold: #dfb566; gold hover: #edca8b. Gold buttons use navy text.
- Paper: #f7f5ef; white: #ffffff; ink: #10283d; muted: #5b6974.
- Dark surfaces: #0b1928 and #11283d; light text: #f4f2ed.
- Content width: 1240px; mobile gutters: 24px; desktop gutters: 56px.
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Headings: system sans-serif, tight tracking, medium weight. Body: system sans-serif, 1.65 line height. No remote font dependency.
- Corners: 4px controls, 10px panels. Prefer restrained borders to shadows.

## Identity and imagery

Use the user-approved blue/gold globe, K, cargo and car logo in `public/brand/kimziz-logo.png`. Preserve its proportions. Use `public/brand/kimziz-logo-transparent.png` on website surfaces so no white tile appears; keep the original PNG as the source asset. Social cards use a solid white canvas for predictable contrast. Use it in the header, footer, admin screens, favicon, and default social-sharing image. The homepage uses a code-native illustration of global trade rather than unverified business photography. Uploaded real imagery can replace it through the content editor. Never present stock or generated vehicles as available inventory.

## Components

Gold primary buttons, understated secondary links with arrows, small uppercase section labels, strong page headings, numbered service lists, accessible empty states, labelled editor fields, visible draft/publication status. Public pages: Home, About, Services, Cars, Contact. Admin is a distinct workspace.

## Responsive and accessible behaviour

Mobile first, no horizontal overflow at 360px. Navigation collapses to an explicitly labelled toggle. Controls have at least 44px targets. Visible keyboard focus, skip link, semantic landmarks, labelled inputs, meaningful image alternatives, reduced-motion support. Light/dark switch persists locally; initial theme follows system preference. Motion is subtle and nonessential. Videos use controls and never autoplay.

## Content

Formal, approachable, premium. Explain what the visitor can ask for without unsupported claims. Keep unknown opening hours, history, routes, and endorsements hidden. Unconnected forms and newsletters remain hidden. WhatsApp opens a prepared message, never sends automatically.
