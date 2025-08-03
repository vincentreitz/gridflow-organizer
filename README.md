# Grid Flow Organizer

A modern, drag-and-drop task organization app built with React, Vite, and Tailwind CSS.

## Features

- Drag and drop interface for organizing tasks
- Modern UI with shadcn/ui components
- Responsive design
- Local storage persistence
- Dark/light theme support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the main branch.

- **Live Site**: https://[your-username].github.io/gridflow-organizer/
- **Build Status**: Check the Actions tab in this repository

### Manual Deployment

If you need to deploy manually:

1. Build the project: `npm run build:gh-pages`
2. The built files will be in the `dist/` directory
3. Deploy the contents of `dist/` to your web server

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Routing**: TanStack Router
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React