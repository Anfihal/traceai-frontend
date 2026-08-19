import { useMutation } from '@tanstack/react-query';
import { contextApi } from '../api/context';
import { useInvestigationStore } from '../stores/investigationStore';

export const useContextCollection = () => {
    const { sessionId, setContext, setStep, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async ({ llmConfig, ragMode }: { llmConfig: any; ragMode: boolean }) => {
            if (!sessionId) throw new Error('Session not started');
            const response = await contextApi.gather(sessionId, llmConfig, ragMode);
            return response.data;
        },
        onSuccess: (data) => {
            setContext(data.context);
            setStep(1);
            addAction('Контекст собран');
        },
        onError: (error) => {
            console.error('Ошибка сбора контекста:', error);
        },
    });
};