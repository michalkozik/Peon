import { createOpenAI } from '@ai-sdk/openai';
import { AppError } from '@/lib/errors';
import type { ChatProvider } from './types';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_REASONING_EFFORT = 'medium' as const;
const DEFAULT_REASONING_SUMMARY = 'detailed' as const;

export function createOpenAiChatProvider(): ChatProvider {
  return {
    id: 'openai',
    resolveModel(modelId: string, apiKey: string) {
      if (!apiKey.trim()) {
        throw new AppError('OpenRouter API key is not configured', 503, 'CHAT_NOT_CONFIGURED');
      }
      const openrouter = createOpenAI({ apiKey, baseURL: OPENROUTER_BASE_URL });
      const openRouterModelId = modelId.includes('/') ? modelId : `openai/${modelId}`;
      return openrouter.responses(openRouterModelId);
    },
    providerOptions(config) {
      if (!config.supportsReasoning) return undefined;
      return {
        openai: {
          reasoningEffort: DEFAULT_REASONING_EFFORT,
          reasoningSummary: DEFAULT_REASONING_SUMMARY,
        },
      };
    },
  };
}
