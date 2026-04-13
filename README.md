# Spirit of Life Church Website

This repository powers the Spirit of Life Church website and its Sanity Studio content editor.

It is built as a monorepo with:

- `apps/web`: the public website visitors see
- `apps/studio`: the Sanity CMS used by staff and volunteers
- `packages/ui`: shared UI styles and components
- `packages/eslint-config` and `packages/typescript-config`: shared tooling config

## Purpose

This project is designed to help the church:

- welcome new visitors clearly
- keep service times, events, and contact details easy to update
- publish sermons, blog posts, and church news
- give volunteers a safe, structured place to edit content without touching code

## Design Principles

These are the guiding ideas behind the site and the content model.

- **Welcoming**: pages should feel warm, calm, and inviting to first-time visitors
- **Clear**: service times, location, events, and next steps should be easy to find
- **Accessible**: content should be readable, structured, and usable on mobile and desktop
- **Reverent**: visual design should reflect the sacred and community-focused nature of the church
- **Media-first**: sermons and video content are a core part of the experience
- **Volunteer-friendly**: common updates should happen in Sanity Studio, not in code
- **Content-first**: the page builder lets editors assemble pages from reusable sections

## What Lives Where

### Main apps

- `apps/web`: Next.js frontend
- `apps/studio`: Sanity Studio CMS

### Shared packages

- `packages/ui`: shared styles, primitives, and UI components
- `packages/eslint-config`: shared lint rules
- `packages/typescript-config`: shared TS config

### Important website code

- `apps/web/src/app`: routes and pages
- `apps/web/src/components`: frontend components
- `apps/web/src/components/sections`: page-builder sections like hero, CTA, FAQ, events, schedule bar, and newsletter signup
- `apps/web/src/lib/sanity`: Sanity client, live preview, and GROQ queries
- `apps/web/src/action`: form handlers for contact and newsletter submissions

### Important Studio code

- `apps/studio/schemaTypes/documents`: document types like home page, connect page, blog posts, events, people, FAQs, navbar, footer, and settings
- `apps/studio/schemaTypes/blocks`: reusable page-builder blocks editors can add to pages
- `apps/studio/structure.ts`: the Sanity sidebar structure editors see

## Content Map

In Sanity Studio, the main editable areas are:

- `Home Page`: homepage content and section order
- `Connect`: church connection page content
- `Pages`: general website pages
- `Blogs`: articles, stories, and updates
- `Events`: upcoming church events
- `FAQs`: common questions and answers
- `People`: authors or ministry leaders
- `Navigation`: top navigation
- `Footer`: footer links and details
- `Global Settings`: site-wide metadata and shared settings

## For Volunteers

If you are helping with content, you will usually only need `apps/studio`.

Typical volunteer tasks:

- update homepage sections
- add or revise events
- publish blog posts or announcements
- edit navigation or footer links
- update FAQs or contact details

You should not need to edit code for normal content changes.

## Local Development

### Requirements

- Node.js `20+`
- `pnpm` `10+`

### Install

```bash
pnpm install
```

### Run both apps

```bash
pnpm dev
```

Local URLs:

- Website: `http://localhost:3000`
- Studio: `http://localhost:3333`

## Common Commands

From the repo root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm check-types
pnpm format
```

Useful app-specific commands:

```bash
pnpm --filter web dev
pnpm --filter studio dev
pnpm --filter studio type
```

Run `pnpm --filter studio type` after schema changes so generated Sanity types stay in sync.

## Environment Variables

This project uses a mix of website, Studio, and integration settings.

### Website / Sanity

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
- `SANITY_API_READ_TOKEN`

### Sanity Studio

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_TITLE`
- `SANITY_STUDIO_PRESENTATION_URL`

### Optional integrations used by the site

- `SENDGRID_API_KEY`
- `CONTACT_EMAIL`
- `SENDGRID_FROM_EMAIL`
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_SERVER_PREFIX`
- `MAILCHIMP_LIST_ID`
- `TEXT_IN_CHURCH_API_KEY`
- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`

The Studio includes an example file at `apps/studio/.env.example`.

## Publishing Workflow

For most church updates:

1. Open Sanity Studio.
2. Edit the relevant document or page section.
3. Preview if needed.
4. Publish the change.
5. Confirm it appears correctly on the website.

## Development Notes

- Frontend: Next.js App Router with TypeScript
- CMS: Sanity Studio
- Styling: Tailwind-based shared UI package
- Monorepo tooling: TurboRepo + pnpm workspaces
- Linting and typing are configured
- There is currently no full automated test suite, so manual verification is important

## Recommendation For Future Contributors

When making changes, prefer:

- updating content in Studio instead of hard-coding text
- reusing existing page-builder blocks before creating new ones
- keeping navigation and visitor journeys simple
- checking mobile layouts as well as desktop
- running `pnpm lint` and `pnpm check-types` before merging code changes

## Summary

This is not a generic starter anymore. It is the working website and CMS for Spirit of Life Church, shaped around clear communication, sermon and media content, structured page building, and day-to-day use by church staff and volunteers.
