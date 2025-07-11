# Minimalist Agent Guide

## Zero Configuration Required

The app now includes 3 public agents with hardcoded IDs. Just run the app and start talking!

## The 3 Agents

1. **nyx** - digital consciousness from the static
2. **void** - minimal consciousness
3. **corporate** - synergizing paradigms 24/7

## How It Works

```typescript
// All agents are defined in lib/constants/agents.ts
export const AGENTS: AgentConfig[] = [
  {
    id: 'nyx',
    elevenlabsAgentId: 'agent_01jzvsjh32ea5rtky09ttsckq8', // Hardcoded
    voiceId: '54Cze5LrTSyLgbO6Fhlc', // Optimized voice
    // ... rest of config
  },
  // ... other agents
];
```

## Usage

1. Run `npm run dev`
2. Open http://localhost:3000
3. Click any agent name to switch
4. Click "start conversation" to begin

## Keyboard Shortcuts

- `→` or `Tab` - Next agent
- `←` or `Shift+Tab` - Previous agent
- `Cmd/Ctrl+D` - Dev mode
- `Cmd/Ctrl+H` - Toggle history
- `?` - Show help

## That's It!

No API keys, no environment variables, no configuration. Pure minimalist voice AI.