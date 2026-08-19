import { useMutation } from '@tanstack/react-query';
import { chatApi } from '../api/chat';
import { useInvestigationStore } from '../stores/investigationStore';

export const useChat = () => {
    const { sessionId, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async (question: string) => {
            if (!sessionId) throw new Error('Session not started');
            const response = await chatApi.ask(sessionId, question);
            return response.data;
        },
        onSuccess: (data) => {
            addAction('Чат: задан вопрос');
            return data.answer;
        },
        onError: (error) => {
            console.error('Ошибка чата:', error);
        },
    });
};