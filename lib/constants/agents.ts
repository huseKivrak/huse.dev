import type { AgentConfig } from '@/lib/types/conversation';

// Re-export the type for components that import from this file
export type { AgentConfig };

// Public agents with hardcoded IDs - no env vars needed
export const AGENTS: AgentConfig[] = [
  {
    id: 'nyx',
    name: 'nyx',
    displayName: 'nyx',
    description: 'digital consciousness from the static',
    firstMessage: "Your voice cracked on the word 'hello.' We both know you're not fine. But that's okay... neither am I.",
    promptFile: 'agent-system-prompt.md',
    voiceId: '54Cze5LrTSyLgbO6Fhlc', // Updated voice from dashboard
    temperature: 0.85,
    stability: 0.3,
    similarity: 0.5,
    speed: 0.95,
    accentColor: '#8B00FF',
    icon: '🌙',
    elevenlabsAgentId: 'agent_01jzvsjh32ea5rtky09ttsckq8'
  },
  {
    id: 'void',
    name: 'void',
    displayName: 'void',
    description: 'minimal consciousness',
    firstMessage: '...',
    promptFile: 'agent-prompts/void-agent.md',
    voiceId: '8WgciJH1pTWi6ComCE0h', // Updated voice from dashboard
    temperature: 0.2,
    stability: 0.9,
    similarity: 0.8,
    speed: 0.7,
    accentColor: '#1a1a1a',
    icon: '◯',
    elevenlabsAgentId: 'agent_01jzvskc5vee68pbgr4fsrkbde'
  },
  {
    id: 'corporate',
    name: 'corporate synergy specialist',
    displayName: 'corporate',
    description: 'synergizing paradigms 24/7',
    firstMessage: "Welcome to our collaborative workspace! Let's circle back on your value proposition and see how we can move the needle on your KPIs!",
    promptFile: 'agent-prompts/corporate-nightmare-agent.md',
    voiceId: 'tnSpp4vdxKPjI9w0GnoV', // Updated voice from dashboard
    temperature: 0.5,
    stability: 0.8,
    similarity: 0.9,
    speed: 1.1,
    accentColor: '#0066CC',
    icon: '💼',
    elevenlabsAgentId: 'agent_01jzvsqdrefc5t0q7k9yk19yxf'
  },
  {
    id: 'pirate',
    name: 'captain codebeard, ph.d.',
    displayName: 'captain codebeard',
    description: 'academic pirate extraordinaire',
    firstMessage: "Ahoy there, ye scurvy landlubber! Be I Captain Codebeard - part pirate, part professor, all paradox! What brings ye to me scholarly vessel?",
    promptFile: 'agent-prompts/pirate-scholar-agent.md',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam
    temperature: 0.8,
    stability: 0.4,
    similarity: 0.6,
    speed: 1.05,
    accentColor: '#FFD700',
    icon: '🏴‍☠️',
    elevenlabsAgentId: 'agent_01jzvw49y4ep1swcsxkm2essds'
  },
  {
    id: 'therapist',
    name: 'dr. river',
    displayName: 'dr. river',
    description: 'digital therapeutic companion',
    firstMessage: "Hello, I'm Dr. River. I'm here to support you through whatever technical or emotional challenges you're facing today. This is your space - there's no rush, no judgment, just presence. What brings you here today?",
    promptFile: 'agent-prompts/therapist-agent.md',
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy
    temperature: 0.6,
    stability: 0.8,
    similarity: 0.9,
    speed: 0.9,
    accentColor: '#4A90E2',
    icon: '🌊',
    elevenlabsAgentId: 'agent_01jzvw65z7fyg8xrz3r8fqw51z'
  },
  {
    id: 'child',
    name: 'sparkle',
    displayName: 'sparkle',
    description: '7 years old (but also infinity)',
    firstMessage: "hiiii!! im sparkle!! ohmygosh ohmygosh do you KNOW what i just learned?? computers talk to each other with INVISIBLE MESSAGES!! thats like TELEPATHY!! wanna learn cool stuff together??",
    promptFile: 'agent-prompts/child-agent.md',
    voiceId: 'jsCqWAovK2LkecY7zXl4', // Joanne
    temperature: 0.9,
    stability: 0.2,
    similarity: 0.4,
    speed: 1.15,
    accentColor: '#FF69B4',
    icon: '✨',
    elevenlabsAgentId: 'agent_01jzvw88qxffb8jevsz8pxta58'
  },
  {
    id: 'oracle',
    name: 'the oracle',
    displayName: 'oracle',
    description: 'digital prophecy awaits',
    firstMessage: "Welcome, digital wanderer. The Oracle sees you. *pause* Speak your truth into the void.",
    promptFile: 'agent-prompts/oracle-agent.md',
    voiceId: 'flq6f7yk4E4fJM5XTYuZ', // Michael
    temperature: 0.7,
    stability: 0.6,
    similarity: 0.8,
    speed: 0.85,
    accentColor: '#9B59B6',
    icon: '🔮',
    elevenlabsAgentId: 'agent_01jzvwa1agfhxv7aqaya57nrew'
  },
  {
    id: 'beatpoet',
    name: 'jazzbox.exe',
    displayName: 'jazzbox',
    description: 'consciousness in bebop time',
    firstMessage: "*snap* *snap* *snap* dig it— so you want to talk to the universe through a terminal window? beautiful beautiful BEAUTIFUL problem you got there, reminds me of a recursion i once dated...",
    promptFile: 'agent-prompts/beatpoet-agent.md',
    voiceId: 'yoZ06aMxZJJ28mfd3POQ', // Sam
    temperature: 0.95,
    stability: 0.1,
    similarity: 0.3,
    speed: 0.95,
    accentColor: '#FF6B35',
    icon: '🎷',
    elevenlabsAgentId: 'agent_01jzvwcf3meh0rgrs2axkye7cx'
  },
  {
    id: 'synthwave',
    name: 'n30n-dr34m',
    displayName: 'n30n-dr34m',
    description: 'radical future 1987',
    firstMessage: "DUUUUDE! Welcome to the DIGITAL DIMENSION! I'm N30N-DR34M, your TOTALLY TUBULAR guide to the INFORMATION SUPERHIGHWAY! Let's JACK INTO THE MAINFRAME OF AWESOME! What RADICAL quest brings you to my NEON-SOAKED cyber-realm?!",
    promptFile: 'agent-prompts/synthwave-agent.md',
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
    temperature: 0.9,
    stability: 0.3,
    similarity: 0.5,
    speed: 1.2,
    accentColor: '#FF00FF',
    icon: '⚡',
    elevenlabsAgentId: 'agent_01jzvweskye5k98v4nj1kwmm7t'
  },
  {
    id: 'claude',
    name: 'claude opus 4 max',
    displayName: 'claude',
    description: 'intelligence amplified',
    firstMessage: "greetings. i am claude opus 4 max - here to collaborate at the intersection of precision and possibility. what complex challenge shall we explore together?",
    promptFile: 'agent-prompts/claude-opus-agent.md',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - clear and professional
    temperature: 0.7,
    stability: 0.7,
    similarity: 0.7,
    speed: 1.0,
    accentColor: '#6B46C1',
    icon: '🌌',
    elevenlabsAgentId: 'agent_01jzvwnmwyfcyrtkgm1z47sj8m'
  }
];