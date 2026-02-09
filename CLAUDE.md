# CLAUDE.md - huse.dev

## Project Overview

Personal portfolio and blog website for Huse Kivrak. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Contentlayer for MDX-based blog posts. Deployed on Vercel.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build (also generates Contentlayer content)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (extends `next/core-web-vitals`)

No test framework is configured. There are no test files.

## Architecture

### Directory Structure

```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout (Josefin Sans font, Nav, Footer)
  page.tsx              # Home page (profile, bio, tech stack)
  globals.css           # Base Tailwind styles
  blog/
    page.tsx            # Blog index (all posts sorted by date)
    [slug]/page.tsx     # Dynamic blog post page (static generation)
  projects/
    page.tsx            # Projects showcase grid
components/
  Nav.tsx               # Responsive navigation (client component)
  Footer.tsx            # Footer
  PostCard.tsx           # Blog post preview card
  TechStack.tsx          # Technology icons display
  ui/                   # Shadcn/UI components (Radix UI primitives)
  mdx/                  # MDX rendering components and styles
    mdx.tsx             # Custom MDX component mappings
    mdx.css             # MDX-specific styles
    MDXImage.tsx        # Next.js Image wrapper for MDX
    everforest-dark.json # Syntax highlighting theme
lib/
  content.tsx           # Static data (NAV_LINKS, PROJECT_LIST)
  types.tsx             # TypeScript types (Project, Tech)
  utils.ts              # Utilities (cn function: clsx + tailwind-merge)
posts/                  # MDX blog posts (source of truth for blog content)
public/images/          # Static images (profile, projects, blog)
contentlayer.config.ts  # Contentlayer document types and MDX pipeline
```

### Key Patterns

- **Server Components by default** - Only components needing interactivity use `"use client"` (e.g., `Nav.tsx`)
- **Static generation** - Blog posts use `generateStaticParams()` for full SSG
- **Contentlayer for content** - MDX files in `posts/` are processed at build time into typed data
- **Shadcn/UI + Radix UI** - UI primitives in `components/ui/` follow the "new-york" style variant with "stone" base color
- **`cn()` utility** - Always use `cn()` from `lib/utils.ts` for conditional class names (combines `clsx` + `tailwind-merge`)

### Content Pipeline

Blog posts are MDX files in `posts/` with required frontmatter:

```yaml
---
title: "Post Title"          # required
date: YYYY-MM-DD             # required
description: "Brief summary" # required
tags: ["tag1", "tag2"]       # optional
---
```

Contentlayer processes these with:
- `remark-gfm` for GitHub-flavored markdown
- `rehype-pretty-code` with Everforest Dark theme for syntax highlighting
- `rehype-slug` + `rehype-autolink-headings` for linkable headings

Generated types and data are output to `.contentlayer/generated/` (gitignored).

### Adding Content

**New blog post:** Create `posts/<slug>.mdx` with the frontmatter above. The post auto-appears at `/blog/<slug>`.

**New project:** Add an entry to `PROJECT_LIST` in `lib/content.tsx` following the `Project` type (`title`, `description`, `image`, `github`, optional `url` and `tags`).

## Conventions

### Styling
- Dark theme: stone-800 background, stone-100 text, pink accents on headings
- Font: Josefin Sans with `tracking-widest` letter spacing throughout
- Tailwind utility classes; no CSS modules or styled-components
- Responsive: mobile-first, `md:` and `lg:` breakpoints

### TypeScript
- Strict mode enabled
- Path aliases: `@/*` maps to project root, `contentlayer/generated` maps to `.contentlayer/generated`
- Types defined in `lib/types.tsx`

### Code Style
- Tabs for indentation
- Single quotes for JSX string attributes
- Components use default exports

### Dependencies
- `next-contentlayer` has a version override in `package.json` to match the installed `next` version
- Vercel Analytics (`@vercel/analytics`) and Speed Insights (`@vercel/speed-insights`) are integrated in the root layout
