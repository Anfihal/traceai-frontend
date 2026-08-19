import { useMutation } from '@tanstack/react-query';
import { artifactsApi } from '../api/artifacts';
import { useInvestigationStore } from '../stores/investigationStore';

export const useArtifacts = () => {
    const { sessionId, setArtifacts, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async () => {
            if (!sessionId) throw new Error('Session not started');
            const response = await artifactsApi.get(sessionId);
            return response.data;
        },
        onSuccess: (data) => {
            setArtifacts(data.artifacts);
            addAction('Артефакты получены');
        },
        onError: (error) => {
            console.error('Ошибка получения артефактов:', error);
        },
    });
};