#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { AGENTS } from '../constants/agents';

// Type definitions
interface AgentCreationResult {
  agentId: string;
  agentName: string;
  elevenlabsAgentId?: string;
  status: 'created' | 'error';
  error?: string;
}

// Load system prompt from file
async function loadSystemPrompt(promptFile: string): Promise<string> {
  try {
    const promptPath = path.join(process.cwd(), promptFile);
    return await readFile(promptPath, 'utf-8');
  } catch {
    console.error(`⚠️  Could not load prompt file ${promptFile}, using fallback`);
    return '';
  }
}

// Main setup function
export async function setupElevenLabsAgents() {
  console.log('🎙️  ElevenLabs Agent Setup Tool');
  console.log('================================\n');

  const results: AgentCreationResult[] = [];

  // Display all agents that will be created
  console.log('📋 Agents to create:\n');
  for (const agent of AGENTS) {
    console.log(`   ${agent.icon || '•'} ${agent.displayName} - ${agent.description}`);
  }

  console.log('\n📌 Note: Use the ElevenLabs MCP tools to create each agent.');
  console.log('   Example command: mcp_ElevenLabs_create_agent\n');

  // Prepare agent configurations
  console.log('📦 Preparing agent configurations...\n');

  for (const agent of AGENTS) {
    try {
      const systemPrompt = await loadSystemPrompt(agent.promptFile);

      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Agent: ${agent.displayName} (${agent.id})`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

      const config = {
        name: agent.displayName,
        first_message: agent.firstMessage,
        system_prompt: systemPrompt || `You are ${agent.name}. ${agent.description}. Your personality and behavior should match your description.`,
        voice_id: agent.voiceId,
        language: 'en',
        llm: 'gemini-2.0-flash-001',
        temperature: agent.temperature,
        stability: agent.stability,
        similarity_boost: agent.similarity,
        speed: agent.speed,
        max_duration_seconds: 300,
        asr_quality: 'high',
        model_id: 'eleven_turbo_v2',
        optimize_streaming_latency: 3,
        record_voice: true,
        retention_days: 730
      };

      console.log('Configuration:');
      console.log(JSON.stringify(config, null, 2));
      console.log('\n');

      results.push({
        agentId: agent.id,
        agentName: agent.displayName,
        status: 'created',
      });

    } catch (error) {
      console.error(`❌ Error preparing ${agent.displayName}:`, error);
      results.push({
        agentId: agent.id,
        agentName: agent.displayName,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Save configurations to file for reference
  const configPath = path.join(process.cwd(), 'lib/scripts/agent-configs.json');
  const configData = await Promise.all(
    AGENTS.map(async (agent) => {
      const systemPrompt = await loadSystemPrompt(agent.promptFile);
      return {
        ...agent,
        systemPrompt: systemPrompt || `You are ${agent.name}. ${agent.description}.`
      };
    })
  );

  await writeFile(configPath, JSON.stringify(configData, null, 2), 'utf-8');
  console.log(`\n💾 Full configurations saved to: ${configPath}`);

  // Summary
  console.log('\n\n📊 Summary:');
  console.log(`   Total agents: ${AGENTS.length}`);
  console.log(`   Prepared successfully: ${results.filter(r => r.status === 'created').length}`);
  console.log(`   Errors: ${results.filter(r => r.status === 'error').length}`);

  console.log('\n📝 Next Steps:');
  console.log('   1. Use the mcp_ElevenLabs_create_agent tool to create each agent');
  console.log('   2. Note the agent IDs returned by ElevenLabs');
  console.log('   3. Update the agent constants with the ElevenLabs agent IDs');
  console.log('   4. Update your .env file with the primary agent ID\n');

  return results;
}

// Execute if run directly
if (require.main === module) {
  setupElevenLabsAgents()
    .then(() => {
      console.log('✅ Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export default setupElevenLabsAgents;