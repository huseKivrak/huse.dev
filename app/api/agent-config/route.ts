import { AGENTS } from '@/lib/constants/agents';
import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get agent parameter from query string
    const searchParams = request.nextUrl.searchParams;
    const agentId = searchParams.get('agent');

    // Find the agent configuration
    const agent = agentId ? AGENTS.find(a => a.id === agentId) : AGENTS[0];
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Load the agent's prompt file
    const promptPath = path.join(process.cwd(), agent.promptFile);
    let systemPrompt = '';

    try {
      systemPrompt = await readFile(promptPath, 'utf-8');
    } catch {
      // Fallback to a basic prompt if file doesn't exist
      systemPrompt = `You are ${agent.name}. ${agent.description}. Your personality and behavior should match your description.`;
    }

    const mcpConfig = {
      serverUrl: process.env.MCP_SERVER_URL || 'https://mcp.neon.tech/sse',
      methods: [
        {
          name: 'query_database',
          description: 'Execute SQL queries on the connected database',
          parameters: {
            query: {
              type: 'string',
              description: 'The SQL query to execute'
            }
          }
        },
        {
          name: 'get_schema',
          description: 'Get the database schema information',
          parameters: {}
        },
        {
          name: 'analyze_data',
          description: 'Analyze data patterns and provide insights',
          parameters: {
            table: {
              type: 'string',
              description: 'The table to analyze'
            }
          }
        }
      ]
    };

    // Agent configuration with voice settings
    const config = {
      agentId: agent.id,
      agentName: agent.name,
      systemPrompt,
      firstMessage: agent.firstMessage,
      voiceConfig: {
        voiceId: agent.voiceId,
        stability: agent.stability,
        similarity: agent.similarity,
        style: 0,
        speakerBoost: true,
        speed: agent.speed
      },
      llmConfig: {
        model: 'gpt-4',
        temperature: agent.temperature,
        maxTokens: 150
      },
      conversationConfig: {
        silenceTimeout: 2000,
        maxDuration: 600000, // 10 minutes
        interruptible: true
      },
      mcpConfig,
      metadata: {
        accentColor: agent.accentColor,
        icon: agent.icon,
        description: agent.description
      }
    };

    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in agent-config:', error);
    return NextResponse.json(
      { error: 'Failed to load agent configuration' },
      { status: 500 }
    );
  }
}

// Enhanced testing endpoint
export async function POST() {
  try {
    // Test both MCP connection and database connectivity
    const tests = [];

    // Test 1: MCP Server connectivity
    try {
      const mcpResponse = await fetch('https://mcp.neon.tech/sse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list'
        })
      });

      const mcpData = await mcpResponse.json();
      tests.push({
        name: 'MCP Server Connection',
        status: mcpResponse.ok ? 'success' : 'failed',
        data: mcpData
      });
    } catch (error) {
      tests.push({
        name: 'MCP Server Connection',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }

    // Test 2: Database connectivity via local connection
    try {
      const { db } = await import('@/lib/db');
      const result = await db.execute('SELECT COUNT(*) as count FROM user_sessions');
      tests.push({
        name: 'Database Connection',
        status: 'success',
        data: { sessionCount: result.rows[0]?.count || 0 }
      });
    } catch (error) {
      tests.push({
        name: 'Database Connection',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }

    return NextResponse.json({
      success: true,
      tests,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Agent config test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}