import { apiClient } from './client';

export const chatApi = {
    ask: (sessionId: string, question: string) =>
        apiClient.post(`/session/${sessionId}/chat`, { question }),
};