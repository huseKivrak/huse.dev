import { NextRequest, NextResponse } from 'next/server';

// Response context interface for advanced responses
interface ResponseContext {
  previousMessages?: Array<{ role: string; content: string }>;
  userMetadata?: Record<string, any>;
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { action, data, context } = await request.json();

    switch (action) {
      case 'generateResponse':
        const response = await generateButlerResponse(data.input, context);
        return NextResponse.json({ response });

      case 'validateAgentId':
        // Validate ElevenLabs agent ID
        const isValid = await validateAgentId(data.agentId);
        return NextResponse.json({ isValid });

      case 'getSessionHistory':
        // Get conversation history for a session
        const history = await getSessionHistory(data.sessionId);
        return NextResponse.json({ history });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateButlerResponse(
  input: string,
  context?: ResponseContext
): Promise<string> {
  const lowerInput = input.toLowerCase();

  // Check for context-aware responses
  if (context?.previousMessages && context.previousMessages.length > 0) {
    // More intelligent responses based on conversation history
    const lastMessage = context.previousMessages[context.previousMessages.length - 1];

    if (lastMessage.content.includes('specific area') &&
        (lowerInput.includes('yes') || lowerInput.includes('sure'))) {
      return 'great! which area interests you most: web applications, ai integrations, or developer tools?';
    }
  }

  // Professional inquiries
  if (lowerInput.includes('about') || lowerInput.includes('who')) {
    return 'i am huse\'s digital assistant. i can help you navigate his work, projects, and technical expertise.';
  }

  if (lowerInput.includes('experience') || lowerInput.includes('work') || lowerInput.includes('skills')) {
    return 'huse is a software engineer with expertise in full-stack development, focusing on modern web technologies, ai integration, and scalable architectures.';
  }

  if (lowerInput.includes('project') || lowerInput.includes('portfolio')) {
    return 'huse has worked on various projects spanning web applications, ai integrations, and developer tools. would you like to know about a specific area?';
  }

  if (lowerInput.includes('contact') || lowerInput.includes('reach')) {
    return 'you can reach huse through his professional channels. would you like me to provide specific contact information?';
  }

  if (lowerInput.includes('technology') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
    return 'huse works with typescript, react, node.js, python, and various ai/ml frameworks. he focuses on modern, scalable solutions.';
  }

  // Conversational responses
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
    return 'hello. how may i assist you today?';
  }

  if (lowerInput.includes('help')) {
    return 'i can provide information about huse\'s work, experience, projects, or technical capabilities. what would you like to know?';
  }

  if (lowerInput.includes('thank')) {
    return 'you\'re welcome. is there anything else you\'d like to know?';
  }

  // AI/ML specific
  if (lowerInput.includes('ai') || lowerInput.includes('machine learning') || lowerInput.includes('ml')) {
    return 'huse has experience integrating ai/ml solutions, including llms, computer vision, and natural language processing into production applications.';
  }

  // Education and background
  if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('degree')) {
    return 'i can provide information about huse\'s educational background and continuous learning in software engineering and ai technologies.';
  }

  // Availability
  if (lowerInput.includes('available') || lowerInput.includes('hire') || lowerInput.includes('freelance')) {
    return 'for information about huse\'s availability for projects or collaborations, please reach out directly through professional channels.';
  }

  // Default intelligent response
  return `i understand you're asking about "${input}". could you be more specific about what you'd like to know regarding huse's work or capabilities?`;
}

async function validateAgentId(agentId: string): Promise<boolean> {
  // Implement ElevenLabs agent validation
  // This is a placeholder - implement actual validation logic
  return Boolean(agentId && agentId.length > 0);
}

async function getSessionHistory(sessionId: string): Promise<any[]> {
  // Implement session history retrieval
  // This is a placeholder - implement actual history logic
  return [];
}