// src/hooks/useStats.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export const useStats = (sessionId: string | null) => {
    return useQuery({
        queryKey: ['stats', sessionId],
        queryFn: async () => {
            if (!sessionId) throw new Error('No session');
            const res = await apiClient.get(`/session/${sessionId}/stats`);
            return res.data;
        },
        enabled: !!sessionId,
    });
};