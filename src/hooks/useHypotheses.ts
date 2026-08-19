import { useMutation } from '@tanstack/react-query';
import { hypothesesApi } from '../api/hypotheses';
import { useInvestigationStore } from '../stores/investigationStore';

export const useHypotheses = () => {
    const { sessionId, setHypotheses, setStep, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async () => {
            if (!sessionId) throw new Error('Session not started');
            const response = await hypothesesApi.generate(sessionId);
            return response.data;
        },
        onSuccess: (data) => {
            setHypotheses(data.hypotheses);
            setStep(2);
            addAction('Гипотезы сгенерированы');
        },
        onError: (error) => {
            console.error('Ошибка генерации гипотез:', error);
        },
    });
};