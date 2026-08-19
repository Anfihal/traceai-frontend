import { useMutation } from '@tanstack/react-query';
import { findingsApi } from '../api/findings';
import { useInvestigationStore } from '../stores/investigationStore';

export const useFindings = () => {
    const { sessionId, addFinding, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async ({ type, value, comment }: { type: string; value: string; comment?: string }) => {
            if (!sessionId) throw new Error('Session not started');
            const response = await findingsApi.add(sessionId, type, value, comment);
            return response.data;
        },
        onSuccess: (data) => {
            addFinding(data.finding);
            addAction(`Добавлена находка: ${data.finding.type} = ${data.finding.value}`);
        },
        onError: (error) => {
            console.error('Ошибка добавления находки:', error);
        },
    });
};