import { apiClient } from './client';

export const reportApi = {
    generate: (sessionId: string) => apiClient.post(`/session/${sessionId}/report`),
};