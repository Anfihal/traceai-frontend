import { apiClient } from './client';

export const sessionApi = {
    start: () => apiClient.post('/session/start'),
};