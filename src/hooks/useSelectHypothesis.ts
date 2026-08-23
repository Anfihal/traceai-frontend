import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvestigationStore } from '@/stores/investigationStore';

export const useSelectHypothesis = () => {
    const { sessionId, setSelectedHypothesisId, setStep, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async (hypothesisId: string) => {
            if (!sessionId) throw new Error('Session not started');
            const response = await apiClient.post(`/session/${sessionId}/select`, { hypothesis_id: hypothesisId });
            return response.data;
        },
        onSuccess: (data) => {
            setSelectedHypothesisId(data.selected_hypothesis);
            setStep(3);
            addAction(`Выбрана гипотеза ${data.selected_hypothesis}`);
        },
        onError: (error) => {
            console.error('Ошибка выбора гипотезы:', error);
        },
    });
};