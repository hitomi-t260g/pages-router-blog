# My Blog

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app) with Contentful CMS integration for blog functionality.

## About This Project

**⚠️ Notice: This is a learning/practice repository created for company training purposes.** 

This project demonstrates modern web development practices including:
- Next.js with TypeScript
- Chakra UI component library
- Contentful CMS integration
- Responsive design with CSS Modules
- State management with Jotai

## Environment Setup

Create a `.env.local` file in the project root with the following variables:

```env
CONTENTFUL_SPACE_ID=your_contentful_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token_here
CONTENTFUL_ENVIRONMENT=master
```

### Contentful Configuration

This blog requires a Contentful Space with a `blogPost` content type containing these fields:

- `title` (Short text) - Blog post title
- `slug` (Short text, unique) - URL slug for the post
- `excerpt` (Long text, optional) - Brief description
- `body` (Rich text, optional) - Main content
- `coverImage` (Media, optional) - Cover image
- `author` (Reference to Author content type, optional) - Post author
- `tags` (Array of Short text, optional) - Post tags
- `publishDate` (Date/Time, optional) - Publication date

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Visit [http://localhost:3000/blog](http://localhost:3000/blog) to see the blog listing page.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

## Project Structure & Directory Organization

This project follows a feature-based architecture with clear separation of concerns:

### Core Principles

**1. Feature-Based Organization**
- Code is organized by functionality rather than by file type
- Each feature contains its own components, hooks, types, and utilities

**2. Clear Separation of Concerns**
- `features/` - Page-specific code
- `commons/` - Shared code across multiple pages
- `components/` - Layout components (transitioning to commons)

### Directory Structure

```
src/
├── commons/           # Shared functionality across pages
│   ├── layout/        # Header, Sidebar components
│   ├── state/         # Global state management (Jotai atoms)
│   └── theme/         # Theme configuration and mood system
├── features/          # Feature-specific code
│   └── blog/          # Blog-related functionality
│       ├── components/    # Blog-only components
│       ├── hooks/         # Blog-specific hooks
│       ├── types/         # Blog type definitions
│       └── utils/         # Blog utility functions
├── components/        # Legacy layout components (being migrated)
│   └── layout/        # → Moving to commons/layout/
├── infra/            # External service integrations
│   └── contentful/   # Contentful CMS client and types
├── pages/            # Next.js page routes
└── styles/           # Global styles and CSS modules
```

### Component Placement Guidelines

**Rule 1: Single Page Usage**
- If a component is used only on one page → `features/[page]/components/`
- Example: `BlogList`, `VideoBackground` → `features/blog/components/`

**Rule 2: Multiple Page Usage**
- If a component is used on 2+ pages → `commons/[domain]/components/`
- Example: `Header`, `Sidebar` → `commons/layout/`

**Rule 3: Avoid Premature Abstraction**
- Don't move components to `commons/` based on "might be reused"
- Start specific (`features/`), generalize when actually needed

### State Management

- **Global State**: `commons/state/` (using Jotai)
- **Feature State**: `features/[feature]/hooks/`
- **Component State**: Local useState/useReducer

### Styling Approach

- **Global Styles**: `styles/globals.css`
- **Component Styles**: CSS Modules (`.module.css`)
- **UI Components**: Chakra UI with custom theming
