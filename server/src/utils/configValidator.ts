/**
 * Config Validator Utility
 * 
 * Validates that startup and runtime configurations are consistent.
 */

import { OPENAI_CONFIG } from '../config/openaiConfig';
import { getResolvedChatModel } from '../config/openaiConfig';
import { getRuntimeConfigSummary } from './openaiDiagnostics';

/**
 * Compare startup and runtime config to ensure consistency
 */
export function validateConfigConsistency(): {
  isConsistent: boolean;
  issues: string[];
  summary: {
    startup: {
      apiKey: string;
      projectId: string | null;
      defaultModel: string;
    };
    runtime: {
      apiKey: string;
      projectId: string | null;
      resolvedModel: string;
    };
  };
} {
  const issues: string[] = [];
  const runtimeConfig = getRuntimeConfigSummary();
  const resolvedModel = getResolvedChatModel();

  // Check API key consistency
  const startupApiKey = OPENAI_CONFIG.API_KEY;
  const runtimeApiKey = process.env.OPENAI_API_KEY || '';
  if (startupApiKey !== runtimeApiKey) {
    issues.push('API key mismatch between startup config and runtime env');
  }

  // Check Project ID consistency
  const startupProjectId = OPENAI_CONFIG.PROJECT_ID;
  const runtimeProjectId = process.env.OPENAI_PROJECT_ID || null;
  if (startupProjectId !== runtimeProjectId) {
    issues.push('Project ID mismatch between startup config and runtime env');
  }

  return {
    isConsistent: issues.length === 0,
    issues,
    summary: {
      startup: {
        apiKey: startupApiKey.substring(0, 10) + '...',
        projectId: startupProjectId,
        defaultModel: OPENAI_CONFIG.DEFAULT_CHAT_MODEL,
      },
      runtime: {
        apiKey: runtimeConfig.apiKeyMasked,
        projectId: runtimeProjectId,
        resolvedModel: resolvedModel,
      },
    },
  };
}

/**
 * Log config consistency check
 */
export function logConfigConsistency(): void {
  const validation = validateConfigConsistency();
  
  console.log('\n' + '='.repeat(60));
  console.log('🔍 Config Consistency Check');
  console.log('='.repeat(60));
  console.log(`Consistent: ${validation.isConsistent ? '✅ Yes' : '❌ No'}`);
  
  if (!validation.isConsistent) {
    console.error('\n⚠️  Configuration Issues:');
    validation.issues.forEach(issue => {
      console.error(`   - ${issue}`);
    });
  }
  
  console.log('\n📋 Startup Configuration:');
  console.log(`   API Key: ${validation.summary.startup.apiKey}...`);
  console.log(`   Project ID: ${validation.summary.startup.projectId || 'Not set'}`);
  console.log(`   Default Model: ${validation.summary.startup.defaultModel}`);
  
  console.log('\n📋 Runtime Configuration:');
  console.log(`   API Key: ${validation.summary.runtime.apiKey}`);
  console.log(`   Project ID: ${validation.summary.runtime.projectId || 'Not set'}`);
  console.log(`   Resolved Model: ${validation.summary.runtime.resolvedModel}`);
  
  console.log('='.repeat(60) + '\n');
}







