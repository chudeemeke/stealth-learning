# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stealth Learning Games SPA - An educational platform delivering learning through engaging games for children aged 3-9, covering Mathematics, English, and Science. Built with React, TypeScript, and Vite, featuring a Progressive Web App architecture with offline capabilities.

## Development Commands

**IMPORTANT: This project uses pnpm exclusively. NEVER use npm or yarn.**

```bash
# Install dependencies (using pnpm)
pnpm install

# Development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test              # Run unit tests with Vitest
pnpm test:ui          # Run tests with UI interface
pnpm test:coverage    # Generate coverage report

# Code quality
pnpm lint             # ESLint with TypeScript
pnpm type-check       # TypeScript type checking
pnpm format           # Prettier formatting

# Component development
pnpm storybook        # Start Storybook on port 6006
pnpm build-storybook  # Build Storybook static files
```

## Architecture Overview

### Frontend Structure
- **React 18+ with TypeScript** - Component-based architecture
- **Redux Toolkit** - Global state management with RTK Query for API calls
- **Vite** - Build tool with hot module replacement
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations and transitions
- **PWA Support** - Offline-first with service workers via vite-plugin-pwa

### Key Architectural Patterns

1. **Age-Adaptive Design System**
   - Components adapt based on user age group (3-5, 6-8, 9 years)
   - Touch target sizes: 64px (3-5), 48px (6-8), standard (9)
   - Progressive complexity in UI and interactions

2. **Path Aliases** (configured in vite.config.ts)
   - `@/` → src/
   - `@components/` → src/components/
   - `@features/` → src/features/
   - `@hooks/` → src/hooks/
   - `@utils/` → src/utils/
   - `@store/` → src/store/
   - `@services/` → src/services/
   - `@assets/` → src/assets/

3. **Component Organization**
   - `/components/ui/` - Reusable UI components (Button, Card, ProgressBar, FeedbackModal)
   - `/components/` - Application-level components (Layout, ErrorBoundary, ProtectedRoute)
   - `/pages/` - Route-level components
   - `/features/` - Feature-specific modules with their own components/hooks/utils

4. **State Management Strategy**
   - Redux Toolkit for global state (user session, progress tracking, game state)
   - React Context for theme/UI preferences
   - Local component state for transient UI states

5. **Adaptive Learning Engine**
   - Elo-rating based difficulty adjustment
   - Real-time performance tracking
   - Zone of Proximal Development (ZPD) maintenance

## Testing Strategy

```bash
# Run specific test file
pnpm test src/components/ui/Button.test.tsx

# Run tests in watch mode
pnpm test --watch

# Run tests matching pattern
pnpm test --grep="Button"
```

## Code Chunking Strategy

The build is optimized with manual chunks (see vite.config.ts):
- `react-vendor`: React core libraries
- `redux-vendor`: State management
- `ui-vendor`: UI animation libraries
- `game-vendor`: Game-specific libraries (audio, confetti)

## Performance Considerations

- Lazy loading for routes and heavy components
- Service worker caching for offline support
- Image optimization with CacheFirst strategy (30-day cache)
- API calls use NetworkFirst strategy with 5-minute cache

## Security & Compliance

- COPPA compliant - No third-party tracking
- Parental controls required for child accounts
- Data encryption for sensitive information
- No external analytics or advertising SDKs