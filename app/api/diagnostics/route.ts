import { AGENTS } from '@/lib/constants/agents';
import { logger } from '@/lib/utils/logger';
import { NextResponse } from 'next/server';

interface DiagnosticTest {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: unknown;
}

export async function GET() {
  const diagnostics: DiagnosticTest[] = [];
  const startTime = Date.now();

  try {
    // Test 1: Check agent configurations
    const agentTest: DiagnosticTest = {
      name: 'Agent Configuration',
      status: 'success',
      message: `${AGENTS.length} agents configured`,
      details: {
        agents: AGENTS.map(agent => ({
          id: agent.id,
          name: agent.displayName,
          hasElevenLabsId: !!agent.elevenlabsAgentId,
          voiceId: agent.voiceId,
        })),
      },
    };

    // Check for missing ElevenLabs IDs
    const missingIds = AGENTS.filter(agent => !agent.elevenlabsAgentId);
    if (missingIds.length > 0) {
      agentTest.status = 'warning';
      agentTest.message += ` (${missingIds.length} missing ElevenLabs IDs)`;
      agentTest.details = {
        ...(agentTest.details as Record<string, unknown>),
        missingElevenLabsIds: missingIds.map(a => a.name),
      };
    }

    diagnostics.push(agentTest);

    // Test 2: Environment variables
    const envTest: DiagnosticTest = {
      name: 'Environment Variables',
      status: 'success',
      message: 'All required environment variables are set',
      details: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasMcpServerUrl: !!process.env.MCP_SERVER_URL,
      },
    };

    const missingEnvVars = [];
    if (!process.env.DATABASE_URL) missingEnvVars.push('DATABASE_URL');
    if (!process.env.POSTGRES_URL) missingEnvVars.push('POSTGRES_URL');

    if (missingEnvVars.length > 0) {
      envTest.status = 'error';
      envTest.message = `Missing environment variables: ${missingEnvVars.join(', ')}`;
    }

    diagnostics.push(envTest);

    // Test 3: Database connectivity
    try {
      const { db } = await import('@/lib/db');
      const result = await db.execute('SELECT 1 as test');

      diagnostics.push({
        name: 'Database Connection',
        status: 'success',
        message: 'Database is accessible',
        details: { connected: true, response: result.rows[0] },
      });
    } catch (error) {
      diagnostics.push({
        name: 'Database Connection',
        status: 'error',
        message: 'Failed to connect to database',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          hint: 'Check DATABASE_URL and POSTGRES_URL environment variables',
        },
      });
    }

    // Test 4: Agent prompt files
    const { readFile } = await import('fs/promises');
    const path = await import('path');

    for (const agent of AGENTS.slice(0, 3)) { // Test first 3 agents
      try {
        const promptPath = path.join(process.cwd(), agent.promptFile);
        const content = await readFile(promptPath, 'utf-8');

        diagnostics.push({
          name: `Agent Prompt: ${agent.name}`,
          status: 'success',
          message: 'Prompt file loaded successfully',
          details: {
            path: agent.promptFile,
            size: content.length,
            preview: content.substring(0, 100) + '...',
          },
        });
      } catch (error) {
        diagnostics.push({
          name: `Agent Prompt: ${agent.name}`,
          status: 'warning',
          message: 'Prompt file not found',
          details: {
            path: agent.promptFile,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    // Test 5: MCP Server connectivity (if configured)
    if (process.env.MCP_SERVER_URL) {
      try {
        const response = await fetch(process.env.MCP_SERVER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list',
          }),
          signal: AbortSignal.timeout(5000),
        });

        diagnostics.push({
          name: 'MCP Server Connection',
          status: response.ok ? 'success' : 'warning',
          message: response.ok ? 'MCP server is reachable' : 'MCP server returned an error',
          details: {
            url: process.env.MCP_SERVER_URL,
            status: response.status,
            statusText: response.statusText,
          },
        });
      } catch (error) {
        diagnostics.push({
          name: 'MCP Server Connection',
          status: 'warning',
          message: 'Failed to connect to MCP server',
          details: {
            url: process.env.MCP_SERVER_URL,
            error: error instanceof Error ? error.message : 'Unknown error',
            hint: 'MCP features may not be available',
          },
        });
      }
    }

    // Calculate overall health
    const errorCount = diagnostics.filter(d => d.status === 'error').length;
    const warningCount = diagnostics.filter(d => d.status === 'warning').length;
    const successCount = diagnostics.filter(d => d.status === 'success').length;

    const overallStatus = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success';
    const overallMessage = errorCount > 0
      ? 'Critical issues detected'
      : warningCount > 0
      ? 'Some issues detected but system is functional'
      : 'All systems operational';

    // Log diagnostics run
    logger.info('Diagnostics completed', {
      duration: Date.now() - startTime,
      status: overallStatus,
      counts: { success: successCount, warning: warningCount, error: errorCount },
    });

    return NextResponse.json({
      status: overallStatus,
      message: overallMessage,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      diagnostics,
      summary: {
        total: diagnostics.length,
        success: successCount,
        warning: warningCount,
        error: errorCount,
      },
    });
  } catch (error) {
    logger.error('Diagnostics failed', {}, error as Error);

    return NextResponse.json({
      status: 'error',
      message: 'Failed to run diagnostics',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    }, { status: 500 });
  }
}

// POST endpoint to test specific agent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId } = body;

    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
    }

    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const tests: DiagnosticTest[] = [];

    // Test agent configuration
    tests.push({
      name: 'Agent Configuration',
      status: agent.elevenlabsAgentId ? 'success' : 'error',
      message: agent.elevenlabsAgentId
        ? 'Agent has valid ElevenLabs ID'
        : 'Agent missing ElevenLabs ID',
      details: {
        id: agent.id,
        name: agent.displayName,
        elevenlabsAgentId: agent.elevenlabsAgentId,
        voiceId: agent.voiceId,
      },
    });

    // Test prompt file
    try {
      const { readFile } = await import('fs/promises');
      const path = await import('path');
      const promptPath = path.join(process.cwd(), agent.promptFile);
      const content = await readFile(promptPath, 'utf-8');

      tests.push({
        name: 'Prompt File',
        status: 'success',
        message: 'Prompt file exists and is readable',
        details: {
          path: agent.promptFile,
          size: content.length,
          hasContent: content.length > 0,
        },
      });
    } catch (error) {
      tests.push({
        name: 'Prompt File',
        status: 'error',
        message: 'Failed to read prompt file',
        details: {
          path: agent.promptFile,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }

    return NextResponse.json({
      agent,
      tests,
      canConnect: tests.every(t => t.status !== 'error'),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Agent test failed', {}, error as Error);

    return NextResponse.json({
      error: 'Failed to test agent',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}