# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project with TypeScript, currently in its initial setup phase. The project uses the App Router and includes ElevenLabs React integration for AI voice conversations.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture

### Core Structure
- **App Router**: Uses Next.js 15 App Router pattern (`app/` directory)
- **TypeScript**: Strict TypeScript configuration with ES2017 target
- **Path Aliases**: `@/*` maps to project root for clean imports
- **Fonts**: Uses Geist Sans and Geist Mono fonts from Google Fonts

### Key Dependencies
- **Next.js 15**: Latest version with App Router
- **React 19**: Latest React version
- **ElevenLabs Integration**: `@elevenlabs/react` for voice AI functionality
- **Tailwind CSS v4**: For styling with PostCSS integration
- **ESLint**: Configured with Next.js TypeScript rules

### Current State
The project is currently using the default create-next-app template with:
- Basic `app/page.tsx` returning "Hello World"
- Standard `app/layout.tsx` with font configuration
- No API routes or custom components yet
- ElevenLabs dependency installed but not yet integrated

## Configuration Files

- `next.config.ts` - Basic Next.js configuration
- `tsconfig.json` - TypeScript with strict mode and Next.js plugin
- `eslint.config.mjs` - ESLint with Next.js core-web-vitals and TypeScript rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS