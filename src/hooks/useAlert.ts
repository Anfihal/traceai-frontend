import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Alert } from '@/types';

export const useAlert = () => {
    const { sessionId, setAlert, setStep, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async (alert: Alert) => {
            if (!sessionId) throw new Error('Session not started');
            const response = await apiClient.post(`/session/${sessionId}/alert`, alert);
            return response.data;
        },
        onSuccess: (data) => {
            setAlert(data.alert);
            setStep(1);  // <-- переключаем на шаг сбора контекста
            addAction('Алерт установлен');
        },
        onError: (error) => {
            console.error('Ошибка установки алерта:', error);
        },
    });
};