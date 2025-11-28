# Cropdot - AI-Powered Carousel Generator

Cropdot is a Next.js 16 application that uses AI to create ready-to-publish social media carousels. It combines an AI-driven generator with granular design controls—including templates, typography, layout, and background customization—so you can go from idea to exportable carousel in minutes.

## Features

### Linear API Integration
- **Automated Issue Creation**: Create Linear issues programmatically from the application
- **CRO Team Integration**: Pre-configured for the CRO (Cropdot) team in Linear
- See [Linear Automation Documentation](./docs/linear-automation.md) for details
- **AI carousel generation**: Generate multi-slide carousels tailored to your topic, platform, and tone.
- **Template system**: Start from curated templates and adjust slide-level patterns, colors, and layouts.
- **Text styling**: Edit headings, body copy, and bullet layers with per-layer visibility controls.
- **Background customization**: Apply gradients, patterns, overlays, and image fills to individual slides or all slides at once.
- **Layout controls**: Resize slides, reorder layers, and adjust alignment for precise compositions.
- **Export-ready output**: Save carousels in the dashboard view and prepare slides for export or reuse.

## Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env.local` file in the project root with your Anthropic API key:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

## Development Workflow
Start the development server on http://localhost:3000:
```bash
npm run dev
```

## Usage
1. Open the app in your browser and enter a **topic**, **goal**, **platform**, and **tone** in the generator form.
2. Click **Generate** to create an AI-driven carousel draft.
3. Switch to the creation view to tweak slides: edit text layers, toggle visibility, adjust alignment, and reorder layers.
4. Customize backgrounds with gradients or patterns, change template styles, and update slide sizes as needed.
5. Save your carousel in the dashboard and export the slides when you are ready to publish.

## Project Structure
- `app/` – Next.js app directory, including the main page and pricing route.
- `components/` – UI components such as the carousel generator, form, and preview experiences.
- `hooks/` – Custom React hooks used across the UI.
- `lib/` – Shared utilities, templates, and type definitions for carousel data.
- `public/` – Static assets.
- `styles/` – Global styling (e.g., Tailwind base styles).

## Available Scripts
- `npm run dev` – Start the development server.
- `npm run build` – Create an optimized production build.
- `npm run start` – Run the production server.
- `npm run lint` – Lint the codebase with ESLint.

## Tech Stack
- **Framework**: Next.js 16 with React 19 and TypeScript.
- **Styling**: Tailwind CSS and Radix UI components.
- **AI Integration**: Anthropic via `@ai-sdk/anthropic` for content generation.
- **Tooling**: ESLint, PostCSS, and Tailwind CSS utilities.
