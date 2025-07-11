import { AGENTS } from '@/lib/constants/agents';
import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId } = body;

    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
    }

    // Find the agent configuration
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Load the system prompt
    let systemPrompt = '';
    try {
      const promptPath = path.join(process.cwd(), agent.promptFile);
      systemPrompt = await readFile(promptPath, 'utf-8');
    } catch {
      systemPrompt = `You are ${agent.name}. ${agent.description}. Your personality and behavior should match your description.`;
    }

    // Prepare the agent configuration for ElevenLabs
    const elevenlabsConfig = {
      name: agent.displayName,
      first_message: agent.firstMessage,
      system_prompt: systemPrompt,
      voice_id: agent.voiceId,
      language: 'en',
      llm: 'gemini-2.0-flash-001',
      temperature: agent.temperature,
      max_tokens: 500,
      asr_quality: 'high',
      model_id: 'eleven_turbo_v2',
      optimize_streaming_latency: 3,
      stability: agent.stability,
      similarity_boost: agent.similarity,
      turn_timeout: 7,
      max_duration_seconds: 300,
      record_voice: true,
      retention_days: 730,
      speed: agent.speed
    };

    // Return the configuration that would be sent to ElevenLabs
    // In a real implementation, you would call the ElevenLabs API here
    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.displayName,
        description: agent.description,
        config: elevenlabsConfig
      },
      message: 'Agent configuration prepared. Use ElevenLabs tools to create the agent.'
    });

  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

// GET endpoint to list all available agents
export async function GET() {
  try {
    const agents = AGENTS.map(agent => ({
      id: agent.id,
      name: agent.displayName,
      description: agent.description,
      icon: agent.icon,
      accentColor: agent.accentColor,
      voiceId: agent.voiceId
    }));

    return NextResponse.json({
      agents,
      total: agents.length
    });
  } catch (error) {
    console.error('Error listing agents:', error);
    return NextResponse.json(
      { error: 'Failed to list agents' },
      { status: 500 }
    );
  }
}