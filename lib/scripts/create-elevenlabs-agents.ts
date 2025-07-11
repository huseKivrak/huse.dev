#!/usr/bin/env node

import { readFile } from 'fs/promises';
import path from 'path';
import { AGENTS } from '../constants/agents';

interface ElevenLabsAgent {
  id: string;
  name: string;
  firstMessage: string;
  systemPrompt: string;
  voiceId: string;
  temperature: number;
  stability: number;
  similarity: number;
  speed: number;
}

// Function to load system prompts from files
async function loadSystemPrompt(promptFile: string): Promise<string> {
  try {
    const promptPath = path.join(process.cwd(), promptFile);
    return await readFile(promptPath, 'utf-8');
  } catch (error) {
    console.error(`Error loading prompt file ${promptFile}:`, error);
    return '';
  }
}

// Convert our agent config to ElevenLabs format
async function prepareAgentForElevenLabs(agent: typeof AGENTS[0]): Promise<ElevenLabsAgent> {
  const systemPrompt = await loadSystemPrompt(agent.promptFile);

  return {
    id: agent.id,
    name: agent.displayName,
    firstMessage: agent.firstMessage,
    systemPrompt,
    voiceId: agent.voiceId,
    temperature: agent.temperature,
    stability: agent.stability,
    similarity: agent.similarity,
    speed: agent.speed
  };
}

// Main function to create all agents
async function createAllAgents() {
  console.log('🚀 Starting ElevenLabs agent creation...\n');

  interface Result {
    agentId: string;
    status: 'ready' | 'error';
    config?: ElevenLabsAgent;
    error?: string;
  }

  const results: Result[] = [];

  for (const agent of AGENTS) {
    console.log(`\n📤 Creating agent: ${agent.displayName} (${agent.id})`);
    console.log(`   Description: ${agent.description}`);
    console.log(`   Voice ID: ${agent.voiceId}`);

    try {
      const elevenlabsAgent = await prepareAgentForElevenLabs(agent);

      // Log the configuration that would be sent
      console.log('\n   Configuration:');
      console.log(`   - Temperature: ${elevenlabsAgent.temperature}`);
      console.log(`   - Stability: ${elevenlabsAgent.stability}`);
      console.log(`   - Similarity: ${elevenlabsAgent.similarity}`);
      console.log(`   - Speed: ${elevenlabsAgent.speed}`);
      console.log(`   - First Message: "${elevenlabsAgent.firstMessage.substring(0, 50)}..."`);

      results.push({
        agentId: agent.id,
        status: 'ready',
        config: elevenlabsAgent
      });

      console.log(`   ✅ Agent configuration prepared successfully`);

    } catch (error) {
      console.error(`   ❌ Error preparing agent: ${error}`);
      results.push({
        agentId: agent.id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  console.log('\n\n📊 Summary:');
  console.log(`Total agents: ${AGENTS.length}`);
  console.log(`Successfully prepared: ${results.filter(r => r.status === 'ready').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'error').length}`);

  // Save results to a file for reference
  const outputPath = path.join(process.cwd(), 'lib/scripts/agent-creation-results.json');
  await import('fs/promises').then(fs => fs.writeFile(
    outputPath,
    JSON.stringify(results, null, 2),
    'utf-8'
  ));
  console.log(`\n💾 Results saved to: ${outputPath}`);

  return results;
}

// Execute if run directly
if (require.main === module) {
  createAllAgents()
    .then(() => {
      console.log('\n✨ Agent creation script completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

export { createAllAgents, prepareAgentForElevenLabs };
