# parker-carson.com

## Section A: Site Overview

**Purpose:**
Parker-Carson.com is a professional portfolio and activity tracker built to showcase photography collections and track daily hobbies. It leverages a modern frontend stack to deliver a highly interactive, media-rich user experience.

**Features:**
- **Content-Driven Pages:** Easily maintainable views for photography galleries and hobby tracking (e.g., daily runs).
- **Mobile-First Design:** Responsive layouts powered by Tailwind CSS to ensure a seamless experience across all devices.
- **TypeScript Safety:** Strongly typed codebase using TypeScript to prevent runtime errors and improve developer experience.
- **Interactive Galleries:** Full-screen, scroll-snap image viewing experiences utilizing `react-modal-image`.
- **Map Integrations:** Activity tracking routes and data visualized via `leaflet`.
- **Theming:** System-level theme synchronization enabled by `next-themes`.

## Section B: Technical Documentation

**Prerequisites:**
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

**Setup:**
Clone the repository and install the required dependencies:
```bash
npm install
```

**Development:**
Start the local development server:
```bash
npm run dev
```

**Building:**
Create an optimized production build:
```bash
npm run build
```

**Architecture Overview:**
- **`components/`**: Reusable UI elements, including specialized components like `Gallery` and `TripMap`.
- **`pages/`**: Next.js routing, with dedicated views for hobbies (running, skiing, golfing).
- **`data/`**: JSON-based "database" for all site content.
- **`public/`**: Stores all static media, organized by activity (e.g., `photography/`, `running/`).

**Deployment:**
This project utilizes a Vercel-based workflow. Pushing changes to the `main` branch will automatically trigger a production deployment. Pull requests will automatically generate functional preview deployments for testing and review before merging.

## Section C: Content Management

This project uses a "Data-as-Code" approach where site content is managed through JSON files in the `data/` directory.

### Updating Activities
To add or edit activities (Running, Skiing, Golfing):
1. Locate the corresponding file in `data/` (e.g., `running.json`).
2. Add a new entry to the JSON array following the existing schema.
3. Place any associated images or videos in the matching folder within `public/`.

### Managing Photography
Galleries are automatically generated based on `data/photos.json`.
1. Create a new folder in `public/photography/` for your collection.
2. Add the folder name and image paths to `data/photos.json`.
3. The site will automatically render the new gallery and handle image optimization.
