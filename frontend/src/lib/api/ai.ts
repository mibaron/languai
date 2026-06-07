import { client } from "@/lib/api/orval/client";
import type { AIContentResponse, AIGenerateRequest, LLMModelOption, UserAIContentItem, UserCreditResponse } from "@/types/ai-content";

export async function generateAIContent(request: AIGenerateRequest): Promise<AIContentResponse> {
  const response = await client.post<AIContentResponse>("/ai/generate/", request);
  return response.data;
}

export async function saveAIContent(aiContentId: string): Promise<void> {
  await client.post(`/ai/${aiContentId}/save/`);
}

export async function unsaveAIContent(savedId: string): Promise<void> {
  await client.delete(`/ai/saved/${savedId}/`);
}

export async function listSavedAIContent(): Promise<UserAIContentItem[]> {
  const response = await client.get<{ results: UserAIContentItem[] }>("/ai/saved/");
  return response.data.results;
}

export async function shareAIContent(savedId: string): Promise<string> {
  const response = await client.post<{ share_key: string }>(`/ai/saved/${savedId}/share/`);
  return response.data.share_key;
}

export async function listModels(): Promise<LLMModelOption[]> {
  const response = await client.get<LLMModelOption[]>("/ai/models/");
  return response.data;
}

export async function getCredit(): Promise<UserCreditResponse> {
  const response = await client.get<UserCreditResponse>("/ai/credit/");
  return response.data;
}
