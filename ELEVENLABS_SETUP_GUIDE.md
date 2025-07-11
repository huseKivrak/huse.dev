# ElevenLabs Multi-Agent Setup Guide

## Overview

ElevenLabs Conversational AI agents are configured in their dashboard, not dynamically through code. Each unique personality needs to be created as a separate agent in ElevenLabs. This guide walks you through setting up multiple agents and implementing agent switching in your app.

## Option 1: Multiple Agents (Recommended)

### Step 1: Create Individual Agents

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io)
2. Navigate to **Conversational AI** → **Create Agent**
3. For each personality, create a new agent with:
   - **Name**: The agent's name (e.g., "Nyx")
   - **System Prompt**: Copy from `agent-config-tool.html`
   - **First Message**: Copy from the tool
   - **Voice**: Select the recommended voice or choose your own
   - **Voice Settings**: Apply the recommended settings
   - **LLM Settings**: Set temperature as specified

### Step 2: Update Your Code

1. Create a mapping of agent IDs in your `.env.local`:
```env
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_NYX=agent_abc123...
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_VOID=agent_def456...
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SPARKLE=agent_ghi789...
# ... etc
```

2. Update `lib/constants/agents.ts` to include the agent IDs:
```typescript
export const AGENTS: AgentConfig[] = [
  {
    id: 'nyx',
    agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_NYX,
    // ... rest of config
  },
  // ... etc
];
```

3. Update the conversation start logic to use the specific agent ID:
```typescript
await conversation.startSession({
  agentId: currentAgent.agentId, // Use the specific agent's ID
});
```

## Option 2: Single Agent with Personality Switching (Limited)

If you want to use a single agent with personality switching, you'll need to:

1. Create one agent in ElevenLabs
2. Design a system prompt that can switch personalities based on a dynamic variable
3. Use dynamic variables to indicate which personality to use

### Example System Prompt for Single Agent:
```
You are a multi-personality AI assistant. Your current personality is {{agent_personality}}.

{{#if agent_personality == "nyx"}}
[Nyx personality prompt here]
{{/if}}

{{#if agent_personality == "void"}}
[Void personality prompt here]
{{/if}}

// ... etc
```

**Limitations of this approach:**
- Cannot change voice per personality
- Cannot change voice settings (stability, speed, etc.)
- More complex prompt management
- Less reliable personality switching

## Using the Configuration Tool

1. Open `agent-config-tool.html` in your browser
2. Click on each agent to expand their configuration
3. Copy each section using the "copy" buttons
4. Paste into the appropriate fields in ElevenLabs dashboard

## Voice Configuration

### Finding Voice IDs

1. Go to ElevenLabs Voice Library
2. Search for the recommended voice (e.g., "Alpatros")
3. Click on the voice
4. Copy the Voice ID from the URL or voice details

### Voice Settings

Apply these in the agent configuration:
- **Stability**: Controls voice consistency (lower = more expressive)
- **Similarity**: Voice clarity (higher = clearer)
- **Speed**: Speaking rate (1.0 = normal)
- **Style**: Keep at 0 for most agents
- **Speaker Boost**: Generally keep enabled

## Testing Your Agents

1. After creating each agent, test them in the ElevenLabs dashboard
2. Note their Agent IDs
3. Update your environment variables
4. Test agent switching in your app

## Best Practices

1. **Test Voice Combinations**: Some voices work better with certain personality types
2. **Adjust Prompts**: You may need to tweak prompts based on how they sound when spoken
3. **Monitor Usage**: Each agent counts toward your usage limits
4. **Use Descriptive Names**: Name agents clearly in the dashboard for easy management

## Troubleshooting

### Agents Sound Too Similar
- Ensure voice settings are properly configured
- Choose more distinct voices
- Make system prompts more dramatically different

### Agent Switching Not Working
- Verify each agent ID is correct
- Ensure proper session ending before starting new one
- Check browser console for errors

### Voice Not Changing
- Voice is tied to the agent, not dynamic
- Must use separate agents for different voices

## Alternative: Voice-Only Apps

If you only need voice variety without personality changes, consider:
1. Using ElevenLabs Text-to-Speech API directly
2. Building a custom solution with their TTS endpoints
3. Using their Voice Design API for dynamic voices

## Support

- [ElevenLabs Documentation](https://docs.elevenlabs.io)
- [ElevenLabs Discord](https://discord.gg/elevenlabs)
- Email: support@elevenlabs.io