import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInvestigationStore } from '@/stores/investigationStore';
import { AlertCircle, Database, Lightbulb, Package } from 'lucide-react';
import { Hypothesis } from '@/types';

export const ContextDisplay: React.FC = () => {
    const { t } = useTranslation();
    const { alert, context, hypotheses, selectedHypothesisId, artifacts } = useInvestigationStore();

    if (!alert && !context && !hypotheses && !artifacts) {
        return (
            <div className="text-sm text-[#676b75] dark:text-[#a3a6af] italic p-4 text-center">
                {t('context.empty')}
            </div>
        );
    }

    return (
        <div className="space-y-3 p-3 bg-[#f7f7f5] dark:bg-[#15161d] rounded-lg border border-[#dfe2e5] dark:border-[#292b34]">
            {/* === Алерт === */}
            {alert && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#171922] dark:text-[#f7f8fa]">
                        <AlertCircle size={16} className="text-[#ff4d4d]" />
                        {t('context.alert')}
                    </div>
                    <div className="pl-6 text-sm text-[#676b75] dark:text-[#a3a6af]">
                        <div>
                            <span className="font-medium text-[#171922] dark:text-[#f7f8fa]">{t('context.rule')}:</span> {alert.rule}
                        </div>
                        <div>
                            <span className="font-medium text-[#171922] dark:text-[#f7f8fa]">{t('context.user')}:</span> {alert.user || t('chat.contextPrefixes.unknown')}
                        </div>
                        <div>
                            <span className="font-medium text-[#171922] dark:text-[#f7f8fa]">{t('context.source')}:</span> {alert.src_ip || 'N/A'} → {alert.dst_ip || 'N/A'}
                        </div>
                        {alert.host && (
                            <div>
                                <span className="font-medium text-[#171922] dark:text-[#f7f8fa]">{t('context.host')}:</span> {alert.host.name}
                            </div>
                        )}
                        {alert.cmd && (
                            <div>
                                <span className="font-medium text-[#171922] dark:text-[#f7f8fa]">{t('context.command')}:</span>{' '}
                                <code className="text-xs bg-[#f0f1f2] dark:bg-[#1b1c24] px-1 rounded">
                                    {alert.cmd}
                                </code>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* === Контекст === */}
            {context && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#171922] dark:text-[#f7f8fa]">
                        <Database size={16} className="text-[#20f0e7]" />
                        {t('context.context')}
                    </div>
                    <div className="pl-6 text-sm text-[#676b75] dark:text-[#a3a6af]">
                        <pre className="text-xs bg-[#f0f1f2] dark:bg-[#1b1c24] p-2 rounded overflow-x-auto max-h-32">
                            {JSON.stringify(context, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            {/* === Гипотезы === */}
            {hypotheses && hypotheses.length > 0 && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#171922] dark:text-[#f7f8fa]">
                        <Lightbulb size={16} className="text-[#20f0e7]" />
                        {t('context.hypotheses')}
                    </div>
                    <div className="pl-6 text-sm text-[#676b75] dark:text-[#a3a6af] space-y-1">
                        {hypotheses.map((h: Hypothesis) => (
                            <div
                                key={h.id}
                                className={`flex items-start gap-1 ${h.id === selectedHypothesisId
                                    ? 'font-semibold text-[#0bbdb7] dark:text-[#20f0e7]'
                                    : ''
                                    }`}
                            >
                                <span>•</span>
                                <span>{h.title}</span>
                                {h.id === selectedHypothesisId && (
                                    <span className="text-xs bg-[#20f0e7]/20 text-[#0bbdb7] dark:text-[#20f0e7] px-1.5 rounded">
                                        {t('context.selected')}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* === Артефакты === */}
            {artifacts && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#171922] dark:text-[#f7f8fa]">
                        <Package size={16} className="text-[#20f0e7]" />
                        {t('context.artifacts')}
                    </div>
                    <div className="pl-6 text-sm text-[#676b75] dark:text-[#a3a6af]">
                        <pre className="text-xs bg-[#f0f1f2] dark:bg-[#1b1c24] p-2 rounded overflow-x-auto max-h-32">
                            {JSON.stringify(artifacts, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};