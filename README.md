# huse.dev

personal website and portfolio for huse, featuring projects showcase and an ai-powered digital assistant.

## overview

this is the source code for [huse.dev](https://huse.dev), a modern, minimalist personal website built with next.js 15, tailwindcss, and supabase. the site features:

- **portfolio showcase** - highlighting key projects and technical work
- **butler assistant** - an ai-powered conversational agent for interactive engagement
- **sleek design** - post-modern aesthetic with blacks and stone greys [[memory:2224217]]
- **responsive layout** - optimized for all devices

## tech stack

- **framework**: next.js 15.3.5 with app router
- **styling**: tailwindcss v4
- **database**: supabase (postgresql)
- **ai integration**: elevenlabs conversational ai
- **deployment**: vercel

## structure

```
huse.dev/
├── huse-dev-app/         # main application
│   ├── app/              # next.js app directory
│   │   ├── page.tsx      # home page
│   │   ├── projects/     # projects showcase
│   │   ├── about/        # about & contact
│   │   └── butler/       # ai assistant interface
│   ├── components/       # reusable components
│   │   ├── ButlerAgent.tsx
│   │   └── Navigation.tsx
│   └── lib/              # utilities & configs
│       └── supabase.ts
└── .vercel/              # deployment configuration
```

## getting started

### prerequisites

- node.js 18+ and npm
- supabase account (for database)
- elevenlabs account (for butler ai)

### installation

1. clone the repository
```bash
git clone https://github.com/yourusername/huse.dev.git
cd huse.dev/huse-dev-app
```

2. install dependencies
```bash
npm install
```

3. set up environment variables
```bash
cp env.example .env.local
```

then edit `.env.local` with your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
```

4. run the development server
```bash
npm run dev
```

open [http://localhost:3000](http://localhost:3000) to view the site.

## deployment

the site is configured for deployment on vercel:

```bash
vercel
```

environment variables are configured in `vercel.json` to use vercel secrets.

## features

### butler assistant
- text and voice interaction modes
- customizable responses
- conversation persistence
- modern glass-morphism ui

### portfolio
- project showcase with live demos
- technical stack highlights
- github integration

### responsive design
- mobile-first approach
- smooth animations
- accessibility focused

## license

mit license - feel free to use this as inspiration for your own projects.

---

built with ❤️ by huse