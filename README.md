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

## Code Quality

This project uses Biome for code formatting and linting. The following scripts are available:

```bash
# Format code
npm run format

# Check formatting without making changes
npm run format:check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Run all checks (format + lint)
npm run check
```

### Pre-commit Hooks

The project includes pre-commit hooks that automatically:
- Format your code using Biome
- Fix linting issues
- Add modified files to staging

These hooks run automatically when you commit changes.

### GitHub Actions

The project includes a GitHub Actions workflow that:
- Runs on push to main/develop branches
- Runs on pull requests to main/develop branches
- Checks code formatting
- Runs linting checks
- Validates TypeScript types

This ensures code quality is maintained before merging changes.

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

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Routing**: TanStack Router
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Code Quality**: Biome (formatting & linting)
- **Git Hooks**: Husky
- **CI/CD**: GitHub Actions