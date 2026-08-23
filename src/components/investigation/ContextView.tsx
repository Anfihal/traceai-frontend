import { useContextCollection } from '@/hooks/useContextCollection';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Loader2 } from 'lucide-react';

export const ContextView = () => {
    const { context } = useInvestigationStore(); // убрали step
    const { mutate: gatherContext, isPending, error } = useContextCollection();

    const handleGather = () => {
        gatherContext({
            llmConfig: {},
            ragMode: false,
        });
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
                <button onClick={handleGather} className="ml-4 underline">Повторить</button>
            </div>
        );
    }

    if (!context) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Контекст ещё не собран.</p>
                <button onClick={handleGather} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
                    Запустить сбор контекста
                </button>
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
        </div>
    );
};