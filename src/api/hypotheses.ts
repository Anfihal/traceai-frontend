import { apiClient } from './client';

export const hypothesesApi = {
    generate: (sessionId: string) => apiClient.post(`/session/${sessionId}/hypotheses`),
};