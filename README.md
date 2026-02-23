# Parker Carson Portfolio

A photography portfolio and activity tracker built with Next.js 16 and React 19.

## Development

```bash
# Setup
npm install

# Local Development
npm run dev

# Production Build
npm run build

# Production Preview
npm run start
```

## Maintenance Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| Lint | `npm run lint` | Identify code quality and security issues. |
| Format | `npx prettier --write .` | Standardize code style project-wide. |
| Reset | `rm -rf .next node_modules` | Perform a clean reinstallation. |

## Technical Implementation

- **Navigation**: Vertical scroll-snap integration for full-screen image viewing.
- **Responsive Design**: Variable grid system optimized for mobile and desktop viewports.
- **Overlay System**: Backdrop-blur lightbox with persistent scroll indicators.
- **Core Stack**: Next.js 16 and React 19 for improved performance and security.
- **Vercel Optimization**: Configured robots.txt for crawler management and optimized cache TTL for static assets.

## Directory Overview

- `components/Gallery/`: Reusable gallery logic and scroll-snap components.
- `pages/photos.tsx`: Photography collection views.
- `pages/hobbies/running.tsx`: Activity records and media management.
- `public/photography/`: Static image assets.

## Configuration

Theme management is handled via `next-themes` for system-level preference synchronization. The lightbox interface utilizes backdrop filters to maintain visual context across different themes.
