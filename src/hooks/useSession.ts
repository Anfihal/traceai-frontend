import { useMutation } from '@tanstack/react-query';
import { sessionApi } from '../api/session';
import { useInvestigationStore } from '../stores/investigationStore';

export const useSession = () => {
    const { setSessionId } = useInvestigationStore();

    return useMutation({
        mutationFn: async () => {
            const response = await sessionApi.start();
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