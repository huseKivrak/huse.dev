# Developer Guide

## Architecture Overview

huse.dev is a minimalist voice AI application built with a focus on developer experience and user delight. The codebase follows a "developer's playground, user's dream" philosophy.

### Tech Stack
- **Next.js 15** - App router with server components
- **TypeScript** - Full type safety
- **ElevenLabs** - Conversational AI
- **Supabase** - Database and edge functions
- **Tailwind CSS v4** - Styling
- **Drizzle ORM** - Type-safe database queries

### Key Features
- **10 Unique AI Agents** - Each with distinct personalities
- **Minimalist UI** - Post-modern design with monospace aesthetic [[memory:2224217]]
- **Developer Console** - Built-in debugging tools
- **Performance Monitoring** - Real-time metrics
- **Error Boundaries** - Graceful error handling
- **Comprehensive Logging** - Structured logging system

## Project Structure

```
huse.dev/
├── app/                      # Next.js app directory
│   ├── components/          # React components
│   ├── api/                 # API routes
│   └── dev/                 # Developer interface
├── lib/                     # Core utilities
│   ├── components/          # Shared components
│   ├── constants/           # Configuration
│   ├── db/                  # Database layer
│   ├── hooks/              # Custom React hooks
│   ├── scripts/            # Build/setup scripts
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities
├── agent-prompts/          # Agent personality files
└── public/                 # Static assets
```

## Core Systems

### 1. Conversation Management

The conversation system is built around the `useConversationManager` hook:

```typescript
const {
  status,
  messages,
  currentAgent,
  error,
  startConversation,
  stopConversation,
  switchAgent,
} = useConversationManager(AGENTS, {
  onConnect: () => {},
  onDisconnect: (reason) => {},
  onMessage: (message) => {},
  onError: (error) => {},
});
```

Features:
- Automatic reconnection with exponential backoff
- Message queuing during connection issues
- Agent-specific logging
- Performance tracking

### 2. Error Handling

Comprehensive error handling with multiple layers:

#### Error Boundary
```typescript
<ErrorBoundary
  fallback={(error, reset) => <CustomError />}
  onError={(error, errorInfo) => {}}
>
  <YourComponent />
</ErrorBoundary>
```

#### Global Error Logging
- Unhandled promise rejections
- Window error events
- React error boundaries
- API call failures

### 3. Logging System

Structured logging with context:

```typescript
import { logger, createLogger } from '@/lib/utils/logger';

// Global logger
logger.info('Something happened', { context: 'value' });
logger.error('Error occurred', {}, error);

// Component-specific logger
const log = createLogger({ component: 'MyComponent' });
log.debug('Debug info');
```

Features:
- Multiple log levels (debug, info, warn, error)
- Buffered logs for debugging
- Export functionality
- Integration ready for monitoring services

### 4. Performance Monitoring

Track performance metrics:

```typescript
import { performanceMonitor } from '@/lib/utils/performance';

// Track custom operations
performanceMonitor.mark('operation-start');
// ... do work
const duration = performanceMonitor.measure('operation-start');

// Track API calls
const result = await performanceMonitor.trackAPICall(
  '/api/endpoint',
  async () => fetch('/api/endpoint')
);

// Track React components
<Profiler id="ComponentName" onRender={onRenderCallback}>
  <Component />
</Profiler>
```

### 5. Developer Console

Built-in developer console (Cmd/Ctrl + D):
- **Logs Tab**: Real-time log viewer with filtering
- **Performance Tab**: Web vitals and custom metrics
- **State Tab**: Application state inspection

## Development Workflow

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `env.example`)
4. Run development server: `npm run dev`

### Database

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Open database studio
npm run db:studio
```

### Agent Management

All agents are pre-configured with hardcoded IDs. No setup required!

To create new agents:
1. Add prompt file to `agent-prompts/`
2. Update `lib/constants/agents.ts`
3. Create agent in ElevenLabs dashboard
4. Update agent ID in configuration

## Keyboard Shortcuts

- `→` / `Tab` - Next agent
- `←` / `Shift+Tab` - Previous agent
- `Cmd/Ctrl + D` - Toggle developer console
- `Cmd/Ctrl + H` - Toggle message history
- `?` - Show help

## Best Practices

### 1. Type Safety

Always use proper TypeScript types:

```typescript
// Good
import type { AgentConfig } from '@/lib/types/conversation';

// Bad
const agent: any = {};
```

### 2. Error Handling

Always handle errors gracefully:

```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { context }, error as Error);
  // Provide user feedback
}
```

### 3. Performance

Use performance monitoring for critical paths:

```typescript
performanceMonitor.mark('critical-operation');
try {
  await criticalOperation();
} finally {
  performanceMonitor.measure('critical-operation');
}
```

### 4. Component Organization

- Keep components small and focused
- Extract reusable logic to hooks
- Use proper prop typing
- Implement error boundaries for critical components

## Testing

### Manual Testing

1. Test all agents for proper switching
2. Verify error handling with network disconnection
3. Check performance metrics in dev console
4. Test keyboard shortcuts
5. Verify mobile responsiveness

### Debugging Tips

1. Use the developer console for real-time logs
2. Export logs for detailed analysis
3. Check performance metrics for bottlenecks
4. Use React DevTools for component inspection
5. Monitor network tab for API issues

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Error monitoring configured
- [ ] Performance baselines established
- [ ] Mobile testing completed
- [ ] Accessibility verified

### Environment Variables

```env
# Database
DATABASE_URL=

# ElevenLabs (optional - agents have hardcoded IDs)
NEXT_PUBLIC_ELEVENLABS_API_KEY=

# Monitoring (optional)
SENTRY_DSN=
```

## Troubleshooting

### Common Issues

1. **Agent not connecting**
   - Check microphone permissions
   - Verify agent ID is correct
   - Check browser console for errors

2. **Performance issues**
   - Open dev console performance tab
   - Check for slow renders
   - Monitor API response times

3. **Database errors**
   - Verify connection string
   - Check migration status
   - Review Supabase logs

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Include error handling
4. Update documentation
5. Test thoroughly

## Architecture Decisions

### Why Minimalist UI?
- Focus on conversation experience
- Reduced cognitive load
- Better performance
- Easier maintenance

### Why Custom Logging?
- Structured data for analysis
- Development-friendly output
- Production-ready integration
- Performance tracking

### Why ElevenLabs?
- Best-in-class voice quality
- Real-time conversation support
- Multiple voice options
- Reliable infrastructure

## Future Enhancements

- [ ] Add test suite
- [ ] Implement analytics
- [ ] Add more agent personalities
- [ ] Enhanced accessibility features
- [ ] PWA support
- [ ] Offline capabilities

---

Remember: This codebase prioritizes developer experience and user delight. Every feature should enhance one or both of these goals.