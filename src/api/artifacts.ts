import { apiClient } from './client';

export const artifactsApi = {
    get: (sessionId: string) => apiClient.get(`/session/${sessionId}/artifacts`),
};