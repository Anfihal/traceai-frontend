import { useContextCollection } from '@/hooks/useContextCollection';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export const ContextView = () => {
    const { context, step } = useInvestigationStore();
    const { mutate: gatherContext, isPending, error } = useContextCollection();

    // Автоматический сбор при переходе на шаг 1 (если контекст ещё не собран)
    useEffect(() => {
        if (step === 1 && !context && !isPending) {
            gatherContext({
                llmConfig: {},
                ragMode: false,
            });
        }
    }, [step, context, isPending, gatherContext]);

    const handleRetry = () => {
        gatherContext({
            llmConfig: {},
            ragMode: false,
        });
    };

    const handleBack = () => {
        useInvestigationStore.getState().setStep(0);
    };

    const handleGoToHypotheses = () => {
        useInvestigationStore.getState().setStep(2);
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Сбор контекста...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                Ошибка сбора контекста: {error.message}
                <button onClick={handleRetry} className="ml-4 underline">Повторить</button>
            </div>
        );
    }

    if (!context) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Контекст ещё не собран.</p>
                <Button onClick={handleRetry} className="mt-4">
                    Запустить сбор контекста
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Собранный контекст</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p><strong>Источник:</strong> {context.src.ip}:{context.src.port}</p>
                    <p><strong>Цель:</strong> {context.dst.ip}:{context.dst.port}</p>
                    <p><strong>Протокол:</strong> {context.proto} ({context.app_proto})</p>
                    <p><strong>Время:</strong> {context.ts}</p>
                </div>
                <div>
                    <p><strong>Пользователь:</strong> {context.user}</p>
                    <p><strong>Репутация:</strong> {context.rpt.verdict}</p>
                    <p><strong>Хэши:</strong> SHA256: {context.sha256 || 'N/A'}</p>
                    <p><strong>MITRE ATT&CK:</strong> {context.att_ck.join(', ')}</p>
                </div>
            </div>
            <p><strong>Команда:</strong> <code>{context.cmd.slice(0, 80)}...</code></p>
            <p><strong>Соседние алерты:</strong> {context.neighbor_alerts.length} записей</p>

            {/* Кнопки навигации */}
            <div className="mt-6 flex flex-wrap gap-4">
                <Button variant="outline" onClick={handleBack}>
                    ← Назад к алерту
                </Button>
                <Button onClick={handleGoToHypotheses}>
                    Сгенерировать гипотезы →
                </Button>
            </div>
        </div>
    );
};