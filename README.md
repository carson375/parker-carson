# Parker-Carson.com

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

**Deployment:**
This project utilizes a Vercel-based workflow. Pushing changes to the `main` branch will automatically trigger a production deployment. Pull requests will automatically generate functional preview deployments for testing and review before merging.
