import { apiClient } from './client';

export const contextApi = {
    gather: (sessionId: string, llmConfig: any, ragMode: boolean) =>
        apiClient.post(`/session/${sessionId}/gather`, { llm_config: llmConfig, rag_mode: ragMode }),
    get: (sessionId: string) => apiClient.get(`/session/${sessionId}/context`),
};