import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { findingsApi } from '@/api/findings';
import { useInvestigationStore } from '@/stores/investigationStore';
import { useEffect } from 'react';

export const useFindings = () => {
    const { sessionId, setFindings, addFinding, removeFinding } = useInvestigationStore();
    const queryClient = useQueryClient();

    const useFindingsList = () => {
        const { data, isLoading, error } = useQuery({
            queryKey: ['findings', sessionId],
            queryFn: async () => {
                if (!sessionId) throw new Error('Session not started');
                const response = await findingsApi.get(sessionId);
                return response.data.findings;
            },
            enabled: !!sessionId,
        });

        useEffect(() => {
            if (data) {
                setFindings(data);
            }
        }, [data, setFindings]);

        return { isLoading, error };
    };

    const useAddFinding = () => {
        return useMutation({
            mutationFn: async ({ type, value, comment }: { type: string; value: string; comment?: string }) => {
                if (!sessionId) throw new Error('Session not started');
                const response = await findingsApi.add(sessionId, type, value, comment);
                return response.data.finding;
            },
            onSuccess: (newFinding) => {
                addFinding(newFinding);
                queryClient.invalidateQueries({ queryKey: ['findings', sessionId] });
            },
        });
    };

    const useDeleteFinding = () => {
        return useMutation({
            mutationFn: async (findingId: string) => {
                if (!sessionId) throw new Error('Session not started');
                await findingsApi.delete(sessionId, findingId);
                return findingId;
            },
            onSuccess: (findingId) => {
                removeFinding(findingId);
                queryClient.invalidateQueries({ queryKey: ['findings', sessionId] });
            },
        });
    };

    return { useFindingsList, useAddFinding, useDeleteFinding };
};