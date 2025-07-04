# butler agent component

a highly configurable digital assistant component for next.js applications with support for text and voice interfaces powered by elevenlabs.

## features

- **dual interface modes**: text and voice interaction
- **fully configurable**: extensive customization options
- **typescript support**: complete type definitions
- **persistent conversations**: optional message history
- **custom response handling**: bring your own ai/response logic
- **theme customization**: dark, light, or custom themes
- **callback hooks**: respond to events and interactions
- **message limits**: control conversation length
- **elevenlabs integration**: seamless voice capabilities

## installation

```bash
npm install @elevenlabs/react
```

## basic usage

```tsx
import ButlerAgent from '@/components/ButlerAgent';

export default function HomePage() {
  return <ButlerAgent />;
}
```

## configuration

### minimal configuration

```tsx
<ButlerAgent
  config={{
    agentName: 'assistant',
    initialMessage: 'how can i help you today?'
  }}
/>
```

### full configuration example

```tsx
<ButlerAgent
  config={{
    // agent settings
    agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
    agentName: 'digital butler',

    // ui customization
    theme: 'dark',
    showTimestamps: true,
    showMode: true,
    placeholder: 'ask me anything...',

    // behavior
    initialMessage: 'welcome. how may i assist you?',
    enableVoice: true,
    enableText: true,
    persistMessages: true,
    maxMessages: 50,

    // response customization
    responseDelay: { min: 500, max: 1500 },
    responseGenerator: async (input) => {
      // custom response logic
      return await generateCustomResponse(input);
    },

    // callbacks
    onMessage: (message) => {
      console.log('new message:', message);
    },
    onError: (error) => {
      console.error('agent error:', error);
    },
    onModeChange: (mode) => {
      console.log('mode changed to:', mode);
    },
    onReset: () => {
      console.log('conversation reset');
    }
  }}
/>
```

## configuration options

| option | type | default | description |
|--------|------|---------|-------------|
| `agentId` | string | env var | elevenlabs agent id |
| `agentName` | string | 'butler' | display name for the agent |
| `theme` | 'dark' \| 'light' \| 'custom' | 'dark' | ui theme |
| `customTheme` | object | - | custom theme colors |
| `initialMessage` | string | 'how can i assist you today?' | first message |
| `placeholder` | string | 'type your message...' | input placeholder |
| `showTimestamps` | boolean | true | show message timestamps |
| `showMode` | boolean | true | show current mode indicator |
| `responseGenerator` | function | - | custom response function |
| `responseDelay` | object | { min: 800, max: 1800 } | response delay range |
| `enableVoice` | boolean | true | enable voice interface |
| `enableText` | boolean | true | enable text interface |
| `persistMessages` | boolean | false | persist messages in localstorage |
| `maxMessages` | number | 100 | maximum messages to keep |
| `onMessage` | function | - | callback for new messages |
| `onError` | function | - | error handler callback |
| `onModeChange` | function | - | mode change callback |
| `onReset` | function | - | reset callback |

## custom response handling

### using the built-in api

by default, the component uses the `/api/elevenlabs` endpoint:

```typescript
// app/api/elevenlabs/route.ts
export async function POST(request: NextRequest) {
  const { action, data, context } = await request.json();

  if (action === 'generateResponse') {
    const response = await generateResponse(data.input, context);
    return NextResponse.json({ response });
  }
}
```

### custom response generator

provide your own response logic:

```tsx
<ButlerAgent
  config={{
    responseGenerator: async (input) => {
      // integrate with openai, anthropic, or any ai service
      const response = await callYourAI(input);
      return response;
    }
  }}
/>
```

### context-aware responses

the api supports conversation context:

```typescript
const response = await fetch('/api/elevenlabs', {
  method: 'POST',
  body: JSON.stringify({
    action: 'generateResponse',
    data: { input: userMessage },
    context: {
      previousMessages: messages,
      sessionId: sessionId,
      userMetadata: { ... }
    }
  })
});
```

## theming

### custom theme example

```tsx
<ButlerAgent
  config={{
    theme: 'custom',
    customTheme: {
      background: 'bg-slate-900',
      foreground: 'text-slate-100',
      accent: 'text-blue-400',
      glass: 'backdrop-blur-md bg-slate-800/30'
    }
  }}
/>
```

## advanced usage

### integration with state management

```tsx
function App() {
  const [messages, setMessages] = useState([]);

  return (
    <ButlerAgent
      config={{
        onMessage: (message) => {
          setMessages(prev => [...prev, message]);
          // sync with your state management
        }
      }}
    />
  );
}
```

### custom ai integration

```tsx
const config = {
  responseGenerator: async (input) => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      body: JSON.stringify({ prompt: input })
    });
    const data = await response.json();
    return data.text;
  }
};
```

### multi-agent setup

```tsx
function MultiAgentPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ButlerAgent
        config={{
          agentName: 'technical assistant',
          responseGenerator: technicalResponses
        }}
      />
      <ButlerAgent
        config={{
          agentName: 'creative assistant',
          responseGenerator: creativeResponses
        }}
      />
    </div>
  );
}
```

## environment variables

```env
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

## styling

the component uses tailwind css and respects your global styles. customize appearance through:

1. the `className` prop for wrapper styles
2. custom theme configuration
3. global css overrides

## troubleshooting

### voice mode not working

- ensure microphone permissions are granted
- check that `agentId` is properly configured
- verify elevenlabs api key is valid

### messages not persisting

- enable `persistMessages: true` in config
- check browser localstorage is available
- verify no localstorage quota issues

### custom responses not working

- ensure `responseGenerator` returns a string or promise<string>
- check for errors in `onError` callback
- verify api endpoints are accessible

## typescript types

```typescript
interface ButlerAgentConfig {
  agentId?: string;
  agentName?: string;
  theme?: 'dark' | 'light' | 'custom';
  customTheme?: {
    background?: string;
    foreground?: string;
    accent?: string;
    glass?: string;
  };
  initialMessage?: string;
  placeholder?: string;
  showTimestamps?: boolean;
  showMode?: boolean;
  responseGenerator?: (input: string) => Promise<string> | string;
  responseDelay?: {
    min: number;
    max: number;
  };
  enableVoice?: boolean;
  enableText?: boolean;
  persistMessages?: boolean;
  maxMessages?: number;
  onMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
  onModeChange?: (mode: AgentMode) => void;
  onReset?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

type AgentMode = 'text' | 'voice';
```