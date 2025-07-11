import { db } from '@/lib/db';
import {
  getConversationAnalytics,
  getDatabaseSchema,
  getSessionSummary,
  getTopAgentPersonalities
} from '@/lib/db/queries';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/db-test - Get database analytics and schema information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('sessionToken');
    const operation = searchParams.get('operation') || 'status';

    switch (operation) {
      case 'analytics':
        const analytics = await getConversationAnalytics(sessionToken || undefined);
        return NextResponse.json({
          success: true,
          data: analytics,
          timestamp: new Date().toISOString()
        });

      case 'session-summary':
        if (!sessionToken) {
          return NextResponse.json({ error: 'Session token required' }, { status: 400 });
        }
        const summary = await getSessionSummary(sessionToken);
        return NextResponse.json({
          success: true,
          data: summary,
          timestamp: new Date().toISOString()
        });

      case 'personalities':
        const personalities = await getTopAgentPersonalities();
        return NextResponse.json({
          success: true,
          data: personalities,
          timestamp: new Date().toISOString()
        });

      case 'schema':
        const schema = await getDatabaseSchema();
        return NextResponse.json({
          success: true,
          data: schema,
          timestamp: new Date().toISOString()
        });

      default:
        // Default status check
        const result = await db.execute('SELECT COUNT(*) as total_sessions FROM user_sessions');
        const conversationCount = await db.execute('SELECT COUNT(*) as total_conversations FROM conversations');

        return NextResponse.json({
          success: true,
          status: 'Database connection healthy',
          stats: {
            totalSessions: result.rows[0]?.total_sessions || 0,
            totalConversations: conversationCount.rows[0]?.total_conversations || 0,
            timestamp: new Date().toISOString()
          }
        });
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/db-test - Run custom queries (for MCP server)
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Security: Only allow SELECT queries
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery.startsWith('select')) {
      return NextResponse.json({
        error: 'Only SELECT queries are allowed for security'
      }, { status: 403 });
    }

    // Execute the query
    const result = await db.execute(query);

    return NextResponse.json({
      success: true,
      data: {
        rows: result.rows,
        rowCount: result.rowCount,
        query: query
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Query execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}