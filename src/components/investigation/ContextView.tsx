import { useContextCollection } from '@/hooks/useContextCollection';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export const ContextView = () => {
    const { context, step } = useInvestigationStore();
    const { mutate: gatherContext, isPending, error } = useContextCollection();

    useEffect(() => {
        if (step === 1 && !context && !isPending) {
            gatherContext({ llmConfig: {}, ragMode: false });
        }
    }, [step, context, isPending, gatherContext]);

    const handleRetry = () => {
        gatherContext({ llmConfig: {}, ragMode: false });
    };

    const handleBack = () => {
        useInvestigationStore.getState().setStep(0);
    };

    const handleGoToHypotheses = () => {
        useInvestigationStore.getState().setStep(2);
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-4 sm:p-8">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                <span className="ml-2 text-sm sm:text-base">Сбор контекста...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 text-destructive p-3 sm:p-4 rounded-md text-sm">
                Ошибка сбора контекста: {error.message}
                <Button variant="outline" onClick={handleRetry} className="ml-4 text-xs sm:text-sm">
                    Повторить
                </Button>
            </div>
        );
    }

    if (!context) {
        return (
            <div className="text-center p-4 sm:p-8">
                <p className="text-sm sm:text-base text-muted-foreground">Контекст ещё не собран.</p>
                <Button onClick={handleRetry} className="mt-3 sm:mt-4 text-sm">
                    Запустить сбор контекста
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold">Собранный контекст</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 text-sm">
                    <p><strong>Источник:</strong> {context.src.ip}:{context.src.port}</p>
                    <p><strong>Цель:</strong> {context.dst.ip}:{context.dst.port}</p>
                    <p><strong>Протокол:</strong> {context.proto} ({context.app_proto})</p>
                    <p><strong>Время:</strong> {context.ts}</p>
                </div>
                <div className="space-y-1 text-sm">
                    <p><strong>Пользователь:</strong> {context.user}</p>
                    <p><strong>Репутация:</strong> {context.rpt.verdict}</p>
                    <p><strong>Хэши:</strong> SHA256: {context.sha256 || 'N/A'}</p>
                    <p><strong>MITRE ATT&CK:</strong> {context.att_ck.join(', ')}</p>
                </div>
            </div>
            <p className="text-sm"><strong>Команда:</strong> <code className="text-xs">{context.cmd.slice(0, 80)}...</code></p>
            <p className="text-sm"><strong>Соседние алерты:</strong> {context.neighbor_alerts.length} записей</p>

            <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
                <Button variant="outline" onClick={handleBack} className="text-sm">
                    ← Назад к алерту
                </Button>
                <Button onClick={handleGoToHypotheses} className="text-sm">
                    Сгенерировать гипотезы →
                </Button>
            </div>
        </div>
    );
};