import { useMutation } from '@tanstack/react-query';
import { reportApi } from '../api/report';
import { useInvestigationStore } from '../stores/investigationStore';

export const useReport = () => {
    const { sessionId, setReport, setStep, addAction } = useInvestigationStore();

    return useMutation({
        mutationFn: async () => {
            if (!sessionId) throw new Error('Session not started');
            const response = await reportApi.generate(sessionId);
            return response.data;
        },
        onSuccess: (data) => {
            setReport(data.report);
            setStep(4);
            addAction('Отчёт сформирован');
        },
        onError: (error) => {
            console.error('Ошибка формирования отчёта:', error);
        },
    });
};