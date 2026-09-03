import React from 'react';
import { useInvestigationStore } from '@/stores/investigationStore';
import { AlertCircle, Database, Lightbulb, Package } from 'lucide-react';
import { Hypothesis } from '@/types';

export const ContextDisplay: React.FC = () => {
    const { alert, context, hypotheses, selectedHypothesisId, artifacts } = useInvestigationStore();

    if (!alert && !context && !hypotheses && !artifacts) {
        return (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4 text-center">
                Нет доступного контекста для отображения
            </div>
        );
    }

    return (
        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {alert && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <AlertCircle size={16} className="text-red-500" />
                        Алерт
                    </div>
                    <div className="pl-6 text-sm text-gray-600 dark:text-gray-400">
                        <div><span className="font-medium">Правило:</span> {alert.rule}</div>
                        <div><span className="font-medium">Пользователь:</span> {alert.user || 'неизвестен'}</div>
                        <div><span className="font-medium">Источник:</span> {alert.src_ip || 'N/A'} → {alert.dst_ip || 'N/A'}</div>
                        {alert.host && <div><span className="font-medium">Хост:</span> {alert.host.name}</div>}
                        {alert.cmd && <div><span className="font-medium">Команда:</span> <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">{alert.cmd}</code></div>}
                    </div>
                </div>
            )}

            {context && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Database size={16} className="text-blue-500" />
                        Контекст
                    </div>
                    <div className="pl-6 text-sm text-gray-600 dark:text-gray-400">
                        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto max-h-32">
                            {JSON.stringify(context, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            {hypotheses && hypotheses.length > 0 && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Lightbulb size={16} className="text-yellow-500" />
                        Гипотезы
                    </div>
                    <div className="pl-6 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {hypotheses.map((h: Hypothesis) => (
                            <div key={h.id} className={`flex items-start gap-1 ${h.id === selectedHypothesisId ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}`}>
                                <span>•</span>
                                <span>{h.title}</span>
                                {h.id === selectedHypothesisId && <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 px-1.5 rounded">выбрана</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {artifacts && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Package size={16} className="text-green-500" />
                        Артефакты
                    </div>
                    <div className="pl-6 text-sm text-gray-600 dark:text-gray-400">
                        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto max-h-32">
                            {JSON.stringify(artifacts, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};