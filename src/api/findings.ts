import { apiClient } from './client';

export const findingsApi = {
    get: (sessionId: string) => apiClient.get(`/session/${sessionId}/findings`),
    add: (sessionId: string, type: string, value: string, comment?: string) =>
        apiClient.post(`/session/${sessionId}/findings`, { type, value, comment }),
    delete: (sessionId: string, findingId: string) =>
        apiClient.delete(`/session/${sessionId}/findings/${findingId}`),
};