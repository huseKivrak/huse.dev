import { validateBody, withErrorHandler, withRateLimit } from '@/lib/api/middleware';
import { getConversationHistory, getOrCreateSession, saveConversation } from '@/lib/db/queries';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

type ConversationBody = {
  message: string;
  isUserMessage: boolean;
  sessionToken?: string;
  agentPersonality?: string;
  metadata?: unknown;
} & Record<string, unknown>;

// POST /api/conversation - Save a new conversation message
export const POST = withErrorHandler(
  async (request: NextRequest) => {
    // Apply rate limiting
    const rateLimit = withRateLimit(30, 60000); // 30 requests per minute
    rateLimit(request);

    // Validate request body
    const body = await validateBody<ConversationBody>(request, {
      message: {
        type: 'string',
        required: true,
        validator: (value) => typeof value === 'string' && value.length > 0,
        message: 'Message must be a non-empty string',
      },
      isUserMessage: {
        type: 'boolean',
        required: true,
      },
      sessionToken: {
        type: 'string',
        required: false,
      },
      agentPersonality: {
        type: 'string',
        required: false,
      },
      metadata: {
        type: 'object',
        required: false,
      },
    });

    // Create or get session
    const token = body.sessionToken || nanoid();
    const session = await getOrCreateSession(token);

    // Save conversation
    const conversation = await saveConversation({
      sessionId: session.id,
      message: body.message,
      isUserMessage: body.isUserMessage,
      agentPersonality: body.agentPersonality,
      metadata: body.metadata,
    });

    return NextResponse.json({
      success: true,
      conversation,
      sessionToken: token,
    });
  },
  {
    name: 'conversation.save',
    logRequest: true,
  }
);

// GET /api/conversation?sessionToken=xxx - Get conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('sessionToken');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!sessionToken) {
      return NextResponse.json({ error: 'Session token is required' }, { status: 400 });
    }

    const session = await getOrCreateSession(sessionToken);
    const history = await getConversationHistory(session.id, limit);

    return NextResponse.json({
      success: true,
      history: history.reverse(), // Return in chronological order
      sessionInfo: {
        id: session.id,
        visitCount: session.visitCount,
        firstVisit: session.firstVisit,
        lastVisit: session.lastVisit,
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch conversation history' }, { status: 500 });
  }
}