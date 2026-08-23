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
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Собранный контекст</h3>

            {/* Основные поля */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p><strong>Источник:</strong> {context.src.ip}:{context.src.port} (хост: {context.src.host_id})</p>
                    <p><strong>Цель:</strong> {context.dst.ip}:{context.dst.port}</p>
                    <p><strong>Геолокация цели:</strong> {context.dst.geo.country}, ASN {context.dst.geo.asn}</p>
                    <p><strong>Протокол:</strong> {context.proto} ({context.app_proto})</p>
                    <p><strong>Время:</strong> {context.ts}</p>
                </div>
                <div className="space-y-2">
                    <p><strong>Пользователь:</strong> {context.user}</p>
                    <p><strong>Репутация цели:</strong> {context.rpt.verdict} (источник: {context.rpt.source})</p>
                    <p><strong>Хэши:</strong> SHA256: {context.sha256 || 'N/A'}, MD5: {context.md5 || 'N/A'}</p>
                    <p><strong>MITRE ATT&CK:</strong> {context.att_ck.join(', ')}</p>
                    {context.event_type && <p><strong>Тип события:</strong> {context.event_type}</p>}
                </div>
            </div>

            {/* Команда */}
            <div>
                <p><strong>Командная строка:</strong></p>
                <code className="bg-muted p-2 rounded block text-sm whitespace-pre-wrap break-all">
                    {context.cmd}
                </code>
            </div>

            {/* Историческая справка */}
            {context.historical_similar && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md">
                    <strong>Историческая справка:</strong> {context.historical_similar}
                </div>
            )}

            {/* Соседние алерты */}
            <div>
                <p><strong>Соседние алерты ({context.neighbor_alerts?.length || 0}):</strong></p>
                {context.neighbor_alerts && context.neighbor_alerts.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 mt-1">
                        {context.neighbor_alerts.map((alert, idx) => (
                            <li key={idx}>
                                {alert.time} – {alert.dst_ip}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">Нет соседних алертов.</p>
                )}
            </div>

            {/* Процессы */}
            {context.processes && context.processes.length > 0 && (
                <div>
                    <p><strong>Процессы на узле ({context.processes.length}):</strong></p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                        {context.processes.map((proc, idx) => (
                            <li key={idx}>
                                PID {proc.pid} – {proc.name} ({proc.cmdline?.slice(0, 80)})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Сетевые соединения */}
            {context.connections && context.connections.length > 0 && (
                <div>
                    <p><strong>Сетевые соединения ({context.connections.length}):</strong></p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                        {context.connections.map((conn, idx) => (
                            <li key={idx}>
                                {conn.local_address}:{conn.local_port} → {conn.remote_address}:{conn.remote_port} (PID {conn.pid})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Действия */}
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