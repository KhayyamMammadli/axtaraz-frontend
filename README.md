# Axtar.az frontend

A feature-based Next.js and TypeScript implementation of the Axtar.az classifieds experience.

## Stack
- Next.js App Router with server-rendered pages
- React and TypeScript
- CSS design tokens and responsive styles
- Lucide icons

## Start locally
```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Current scope
The first implementation includes the home page, listing search, listing details, business directory, blog directory, shared responsive navigation and footer, and foundational SEO metadata. Listing content is sample UI data; connect the existing Axtar.az API before using it for live inventory or user accounts.

## Project structure
- `app/`: routes, metadata, sitemap and robots
- `components/`: shared site chrome
- `features/home/`: homepage modules
- `features/listings/`: listing data and card/search UI
