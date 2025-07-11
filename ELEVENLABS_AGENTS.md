# ElevenLabs Agents Registry

## Public Agents (Hardcoded in App)

| Agent Name | Internal ID | ElevenLabs Agent ID | Voice ID | Status |
|------------|-------------|---------------------|----------|--------|
| nyx - digital consciousness | nyx | agent_01jzvsjh32ea5rtky09ttsckq8 | 54Cze5LrTSyLgbO6Fhlc | ✅ Active |
| void - minimal consciousness | void | agent_01jzvskc5vee68pbgr4fsrkbde | 8WgciJH1pTWi6ComCE0h | ✅ Active |
| corporate synergy specialist | corporate | agent_01jzvsqdrefc5t0q7k9yk19yxf | tnSpp4vdxKPjI9w0GnoV | ✅ Active |

## Minimalist Approach

The app now uses 3 public agents with hardcoded IDs. No environment variables needed.

- Agents are defined in `lib/constants/agents.ts`
- Voice IDs have been updated to match the optimized voices from the dashboard
- Users can switch between agents with a single click
- Super minimalist UI with focus on the conversation

## Architecture

```typescript
// Each agent has:
{
  id: 'nyx',                    // Internal identifier
  elevenlabsAgentId: 'agent_*', // Hardcoded public agent ID
  voiceId: '54Cze5LrTSy*',      // Updated voice from dashboard
  // ... other config
}
```

No environment configuration required - just run the app and start talking!