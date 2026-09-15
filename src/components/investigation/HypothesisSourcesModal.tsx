import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Database, Server, Globe, Brain, ShieldCheck } from 'lucide-react';
import { Hypothesis } from '@/types';

interface HypothesisSourcesModalProps {
    hypothesis: Hypothesis;
    onClose: () => void;
}

const SOURCE_ICONS: Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
> = {
    siem: Database,
    edr: Server,
    nta: Globe,
    reputation: ShieldCheck,
    vector: Brain,
};

export const HypothesisSourcesModal: React.FC<HypothesisSourcesModalProps> = ({
    hypothesis,
    onClose,
}) => {
    const { t } = useTranslation();

    // Источники могут приходить с бэкенда как hypothesis.sources
    const sources = (hypothesis as any).sources || [];

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#15161d] rounded-xl border border-[#dfe2e5] dark:border-[#292b34] shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Заголовок */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#dfe2e5] dark:border-[#292b34] shrink-0">
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-[#171922] dark:text-[#f7f8fa]">
                            {t('hypotheses.sourcesTitle')}
                        </h3>
                        <p className="text-xs text-[#676b75] dark:text-[#a3a6af] mt-0.5 truncate">
                            {hypothesis.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 text-[#676b75] hover:text-[#171922] dark:text-[#a3a6af] dark:hover:text-[#f7f8fa] transition-colors p-1"
                        title={t('hypotheses.close')}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Тело */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                    {sources.length === 0 ? (
                        <p className="text-sm text-[#676b75] dark:text-[#a3a6af] italic text-center py-8">
                            {t('hypotheses.noSources')}
                        </p>
                    ) : (
                        sources.map((s: any, i: number) => {
                            const Icon = SOURCE_ICONS[s.type] || Database;
                            return (
                                <div
                                    key={i}
                                    className="p-4 rounded-lg border border-[#dfe2e5] dark:border-[#292b34] bg-[#f7f7f5] dark:bg-[#1b1c24]"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0 w-9 h-9 rounded-md bg-[#20f0e7]/10 flex items-center justify-center">
                                            <Icon size={18} className="text-[#20f0e7]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-sm font-semibold text-[#171922] dark:text-[#f7f8fa]">
                                                    {s.source || s.name || t('hypotheses.source')}
                                                </span>
                                                <span className="text-[10px] uppercase tracking-wider bg-[#20f0e7]/10 text-[#0bbdb7] dark:text-[#20f0e7] px-1.5 py-0.5 rounded">
                                                    {s.type || 'n/a'}
                                                </span>
                                                {s.confidence !== undefined && (
                                                    <span className="text-[10px] text-[#676b75] dark:text-[#a3a6af] ml-auto">
                                                        {t('hypotheses.confidence')}:{' '}
                                                        {(s.confidence * 100).toFixed(0)}%
                                                    </span>
                                                )}
                                            </div>
                                            {s.value && (
                                                <pre className="text-xs bg-[#f0f1f2] dark:bg-[#0d0e13] p-2 rounded overflow-x-auto max-h-32 text-[#171922] dark:text-[#f7f8fa] mt-2">
                                                    {typeof s.value === 'string'
                                                        ? s.value
                                                        : JSON.stringify(s.value, null, 2)}
                                                </pre>
                                            )}
                                            {s.description && (
                                                <p className="text-xs text-[#676b75] dark:text-[#a3a6af] mt-1">
                                                    {s.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Футер */}
                <div className="px-5 py-3 border-t border-[#dfe2e5] dark:border-[#292b34] flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-full border border-[#dfe2e5] dark:border-[#292b34] text-[#171922] dark:text-[#f7f8fa] hover:border-[#20f0e7] transition-colors"
                    >
                        {t('hypotheses.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};