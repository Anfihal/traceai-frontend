import { apiClient } from './client';
import { Alert } from '../types';

export const alertApi = {
    set: (sessionId: string, alert: Alert) => apiClient.post(`/session/${sessionId}/alert`, alert),
};