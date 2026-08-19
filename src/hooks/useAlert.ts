import { useMutation } from '@tanstack/react-query';
import { alertApi } from '../api/alert';
import { useInvestigationStore } from '../stores/investigationStore';
import { Alert } from '../types';

export const useAlert = () => {
    const { sessionId, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async (alert: Alert) => {
            if (!sessionId) throw new Error('Session not started');
            const response = await alertApi.set(sessionId, alert);
            return response.data;
        },
        onSuccess: () => {
            addAction('Алерт установлен');
        },
        onError: (error) => {
            console.error('Ошибка установки алерта:', error);
        },
    });
};