import { AGENTS } from '@/lib/constants/agents';
import { NextResponse } from 'next/server';

/**
 * Test endpoint to verify agent connection setup
 * Helps debug infinite loop issues
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, agentId } = body;

    const agent = agentId ? AGENTS.find(a => a.id === agentId) : AGENTS[0];
    if (!agent) {
      return NextResponse.json({
        error: 'Agent not found',
        availableAgents: AGENTS.map(a => a.id),
      }, { status: 404 });
    }

    switch (action) {
      case 'validate': {
        // Validate agent configuration
        const validation = {
          agent: {
            id: agent.id,
            name: agent.displayName,
            hasElevenLabsId: !!agent.elevenlabsAgentId,
            elevenlabsAgentId: agent.elevenlabsAgentId,
          },
          environment: {
            nodeEnv: process.env.NODE_ENV,
            hasDatabase: !!process.env.DATABASE_URL,
          },
          checks: {
            agentIdValid: !!agent.elevenlabsAgentId,
            promptFileExists: await checkPromptFile(agent.promptFile),
          },
        };

        return NextResponse.json({
          success: validation.checks.agentIdValid,
          validation,
          timestamp: new Date().toISOString(),
        });
      }

      case 'simulate-connection': {
        // Simulate connection lifecycle
        const steps = [];

        steps.push({
          step: 'request-microphone',
          timestamp: new Date().toISOString(),
          wouldSucceed: true, // Can't actually test in API route
        });

        steps.push({
          step: 'validate-agent-id',
          timestamp: new Date().toISOString(),
          success: !!agent.elevenlabsAgentId,
          agentId: agent.elevenlabsAgentId,
        });

        if (agent.elevenlabsAgentId) {
          steps.push({
            step: 'start-session',
            timestamp: new Date().toISOString(),
            payload: {
              agentId: agent.elevenlabsAgentId,
              dynamicVariables: {
                session_token: 'test-token',
                agent_name: agent.name,
                timestamp: new Date().toISOString(),
              },
            },
          });
        }

        return NextResponse.json({
          success: !!agent.elevenlabsAgentId,
          steps,
          timestamp: new Date().toISOString(),
        });
      }

      case 'test-state-flow': {
        // Test state transitions
        const stateFlow = [
          { state: 'idle', trigger: 'startConversation', nextState: 'connecting' },
          { state: 'connecting', trigger: 'onConnect', nextState: 'connected' },
          { state: 'connected', trigger: 'onDisconnect', nextState: 'idle' },
          { state: 'connecting', trigger: 'onError', nextState: 'error' },
          { state: 'error', trigger: 'startConversation', nextState: 'connecting' },
        ];

        return NextResponse.json({
          stateFlow,
          notes: {
            noAutoReconnect: 'onDisconnect goes to idle, not connecting',
            preventConcurrent: 'operationInProgress ref prevents concurrent operations',
            cleanupOnUnmount: 'isUnmounting ref prevents operations during cleanup',
          },
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: ['validate', 'simulate-connection', 'test-state-flow'],
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

async function checkPromptFile(promptFile: string): Promise<boolean> {
  try {
    const { readFile } = await import('fs/promises');
    const path = await import('path');
    const promptPath = path.join(process.cwd(), promptFile);
    await readFile(promptPath, 'utf-8');
    return true;
  } catch {
    return false;
  }
}