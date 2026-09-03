import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvestigationStore } from '@/stores/investigationStore';

export const useTips = () => {
    const { sessionId, step } = useInvestigationStore();

    return useMutation({
        mutationFn: async () => {
            if (!sessionId) throw new Error('Session not started');
            const response = await apiClient.post(`/session/${sessionId}/tips`, { step });
            return response.data.tips;
        },
    });
};