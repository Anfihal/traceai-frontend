import { apiClient } from './client';

export const findingsApi = {
    add: (sessionId: string, type: string, value: string, comment?: string) =>
        apiClient.post(`/session/${sessionId}/findings`, { type, value, comment }),
};