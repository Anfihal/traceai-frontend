import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useInvestigationStore } from '../stores/investigationStore';

export const useSession = () => {
    const { setSessionId } = useInvestigationStore();

    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/session/start');
            return response.data;
        },
        onSuccess: (data) => {
            setSessionId(data.session_id);
        },
        onError: (error) => {
            console.error('Ошибка старта сессии:', error);
        },
    });
};