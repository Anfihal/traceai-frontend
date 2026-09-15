import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHypotheses } from '@/hooks/useHypotheses';
import { useSelectHypothesis } from '@/hooks/useSelectHypothesis';
import { useInvestigationStore } from '@/stores/investigationStore';
import { useChat } from '@/contexts/ChatContext';
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Database,
    MessageSquare,
    Terminal,
    Shield,
    Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { HypothesisSourcesModal } from './HypothesisSourcesModal';
import { HypothesisConsoleModal } from './HypothesisConsoleModal';
import { Hypothesis } from '@/types';

const HypothesisTree = () => {
    const { t } = useTranslation();
    const {
        hypotheses,
        selectedHypothesisId,
        step,
        setStep,
    } = useInvestigationStore();
    const { openChat } = useChat();

    const {
        mutate: generateHypotheses,
        isPending: isGenerating,
        error: generateError,
    } = useHypotheses();
    const {
        mutate: selectHypothesis,
        isPending: isSelecting,
        error: selectError,
    } = useSelectHypothesis();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [sourcesModal, setSourcesModal] = useState<Hypothesis | null>(null);
    const [consoleModal, setConsoleModal] = useState<Hypothesis | null>(null);

    useEffect(() => {
        if (step === 2 && !hypotheses && !isGenerating) {
            generateHypotheses();
        }
    }, [step, hypotheses, isGenerating, generateHypotheses]);

    const handleGenerate = () => {
        generateHypotheses();
    };

    const handleSelect = () => {
        if (selectedId) {
            selectHypothesis(selectedId);
        }
    };

    // === Отправка гипотезы в чат ===
    const sendToChat = (hyp: Hypothesis) => {
        const prompt = [
            `[${t('hypotheses.sourcesTitle')}] ${hyp.title}`,
            '',
            `${t('hypotheses.factsFor')}:`,
            ...(hyp.evidence_for || []).map((f: string) => `  - ${f}`),
            '',
            `${t('hypotheses.factsAgainst')}:`,
            ...(hyp.evidence_against || []).map((f: string) => `  - ${f}`),
            '',
            hyp.att_ck && hyp.att_ck.length > 0 ? `${t('hypotheses.mitre')}: ${hyp.att_ck.join(', ')}` : '',
            hyp.llm_comment ? `LLM: ${hyp.llm_comment}` : '',
        ]
            .filter(Boolean)
            .join('\n');

        openChat(prompt);
        toast.info(t('hypotheses.sentToChat'));
    };

    // === Состояния загрузки / ошибок ===
    if (isGenerating) {
        return (
            <div className="flex items-center justify-center p-8 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#20f0e7]" />
                <span className="text-sm text-[#676b75] dark:text-[#a3a6af]">
                    {t('generate_hypotheses')}...
                </span>
            </div>
        );
    }

    if (generateError) {
        return (
            <div className="bg-[#ff4d4d]/10 text-[#ff4d4d] p-4 rounded-md text-sm">
                {t('context_error')}: {generateError.message}
                <button
                    onClick={handleGenerate}
                    className="ml-4 underline hover:no-underline"
                >
                    {t('retry')}
                </button>
            </div>
        );
    }

    if (!hypotheses || hypotheses.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-[#676b75] dark:text-[#a3a6af] text-sm">
                    {t('no_findings')}
                </p>
                <Button
                    onClick={handleGenerate}
                    className="mt-4 bg-[#20f0e7] hover:bg-[#0bd6cf] text-[#06100f]"
                >
                    {t('generate_hypotheses')}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#171922] dark:text-[#f7f8fa]">
                {t('hypotheses_tree')}
            </h3>

            <div className="space-y-3">
                {hypotheses.map((hyp: Hypothesis) => {
                    const isSelected = selectedId === hyp.id;
                    const isConfirmed = selectedHypothesisId === hyp.id;
                    const probability = (hyp as any).probability ?? (hyp as any).confidence ?? 0;

                    return (
                        <div
                            key={hyp.id}
                            className={`rounded-xl border transition-all ${isConfirmed
                                ? 'border-[#20f0e7] bg-[#20f0e7]/5'
                                : isSelected
                                    ? 'border-[#20f0e7]/60 bg-[#20f0e7]/[0.03]'
                                    : 'border-[#dfe2e5] dark:border-[#292b34] bg-white dark:bg-[#15161d] hover:border-[#20f0e7]/40'
                                }`}
                        >
                            {/* === Верхняя часть === */}
                            <div
                                className="flex items-start gap-3 p-4 cursor-pointer"
                                onClick={() => setSelectedId(hyp.id)}
                            >
                                {/* Radio */}
                                <div className="mt-0.5 shrink-0">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                            ? 'border-[#20f0e7] bg-[#20f0e7]'
                                            : 'border-[#dfe2e5] dark:border-[#292b34]'
                                            }`}
                                    >
                                        {isSelected && (
                                            <CheckCircle2 size={14} className="text-[#06100f]" />
                                        )}
                                    </div>
                                </div>

                                {/* Контент */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h4 className="text-sm font-bold text-[#171922] dark:text-[#f7f8fa]">
                                            {hyp.title}
                                        </h4>
                                        {probability > 0 && (
                                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#20f0e7]/10 text-[#0bbdb7] dark:text-[#20f0e7]">
                                                {(probability * 100).toFixed(0)}%
                                            </span>
                                        )}
                                        <span className="text-[10px] font-mono text-[#676b75] dark:text-[#a3a6af]">
                                            ID: {hyp.id}
                                        </span>
                                        {hyp.status && (
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full ${hyp.status === 'требует проверки' ||
                                                    hyp.status === 'requires verification'
                                                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                                    : 'bg-[#20f0e7]/10 text-[#0bbdb7] dark:text-[#20f0e7]'
                                                    }`}
                                            >
                                                {hyp.status}
                                            </span>
                                        )}
                                    </div>

                                    {hyp.att_ck && hyp.att_ck.length > 0 && (
                                        <div className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#676b75] dark:text-[#a3a6af]">
                                            <Shield size={12} />
                                            <span>{t('hypotheses.mitre')}: {hyp.att_ck.join(' · ')}</span>
                                        </div>
                                    )}

                                    {/* Факты ЗА / ПРОТИВ */}
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {hyp.evidence_for && hyp.evidence_for.length > 0 && (
                                            <div className="space-y-1">
                                                <div className="text-[10px] uppercase tracking-wider text-[#0bbdb7] dark:text-[#20f0e7] font-semibold">
                                                    {t('hypotheses.factsFor')}
                                                </div>
                                                <ul className="space-y-0.5">
                                                    {hyp.evidence_for.map((f: string, i: number) => (
                                                        <li
                                                            key={i}
                                                            className="text-xs text-[#171922] dark:text-[#f7f8fa] flex gap-1.5"
                                                        >
                                                            <CheckCircle2
                                                                size={12}
                                                                className="shrink-0 mt-0.5 text-[#0bbdb7] dark:text-[#20f0e7]"
                                                            />
                                                            <span>{f}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {hyp.evidence_against && hyp.evidence_against.length > 0 && (
                                            <div className="space-y-1">
                                                <div className="text-[10px] uppercase tracking-wider text-[#ff4d4d] font-semibold">
                                                    {t('hypotheses.factsAgainst')}
                                                </div>
                                                <ul className="space-y-0.5">
                                                    {hyp.evidence_against.map((f: string, i: number) => (
                                                        <li
                                                            key={i}
                                                            className="text-xs text-[#171922] dark:text-[#f7f8fa] flex gap-1.5"
                                                        >
                                                            <XCircle
                                                                size={12}
                                                                className="shrink-0 mt-0.5 text-[#ff4d4d]"
                                                            />
                                                            <span>{f}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* LLM-комментарий */}
                                    {hyp.llm_comment && (
                                        <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-[#f7f7f5] dark:bg-[#1b1c24] border border-[#dfe2e5] dark:border-[#292b34]">
                                            <Lightbulb
                                                size={14}
                                                className="shrink-0 mt-0.5 text-[#20f0e7]"
                                            />
                                            <div>
                                                <div className="text-[10px] uppercase tracking-wider text-[#676b75] dark:text-[#a3a6af] font-semibold">
                                                    {t('llm_comment')}
                                                </div>
                                                <p className="text-xs text-[#171922] dark:text-[#f7f8fa] mt-0.5">
                                                    {hyp.llm_comment}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {isConfirmed && (
                                        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#0bbdb7] dark:text-[#20f0e7] font-semibold">
                                            <CheckCircle2 size={14} />
                                            {t('selected_hypothesis_metric')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* === Нижняя панель действий === */}
                            <div className="flex items-center gap-1 px-4 py-2 border-t border-[#dfe2e5] dark:border-[#292b34]">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSourcesModal(hyp);
                                    }}
                                    className="h-7 px-2 gap-1.5 text-xs text-[#676b75] hover:text-[#20f0e7] dark:text-[#a3a6af] dark:hover:text-[#20f0e7]"
                                >
                                    <Database size={13} />
                                    {t('hypotheses.actions.sources')}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        sendToChat(hyp);
                                    }}
                                    className="h-7 px-2 gap-1.5 text-xs text-[#676b75] hover:text-[#20f0e7] dark:text-[#a3a6af] dark:hover:text-[#20f0e7]"
                                >
                                    <MessageSquare size={13} />
                                    {t('hypotheses.actions.chat')}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConsoleModal(hyp);
                                    }}
                                    className="h-7 px-2 gap-1.5 text-xs text-[#676b75] hover:text-[#20f0e7] dark:text-[#a3a6af] dark:hover:text-[#20f0e7]"
                                >
                                    <Terminal size={13} />
                                    {t('hypotheses.actions.console')}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* === Кнопки управления === */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                    onClick={handleSelect}
                    disabled={!selectedId || isSelecting}
                    className="px-6 bg-[#20f0e7] hover:bg-[#0bd6cf] text-[#06100f] disabled:opacity-40"
                >
                    {isSelecting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {t('confirm_choice')}
                </Button>
                {selectedId && (
                    <span className="text-sm text-[#676b75] dark:text-[#a3a6af]">
                        {t('selected_hypothesis_metric')}:{' '}
                        {hypotheses.find((h: Hypothesis) => h.id === selectedId)?.title}
                    </span>
                )}
            </div>

            <div>
                <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-[#dfe2e5] dark:border-[#292b34] text-[#171922] dark:text-[#f7f8fa] hover:border-[#20f0e7]"
                >
                    {t('back_to_context')}
                </Button>
            </div>

            {selectError && (
                <div className="text-[#ff4d4d] text-sm">
                    {t('context_error')}: {selectError.message}
                </div>
            )}

            {/* === Модалки === */}
            {sourcesModal && (
                <HypothesisSourcesModal
                    hypothesis={sourcesModal}
                    onClose={() => setSourcesModal(null)}
                />
            )}
            {consoleModal && (
                <HypothesisConsoleModal
                    hypothesis={consoleModal}
                    onClose={() => setConsoleModal(null)}
                />
            )}
        </div>
    );
};

export default HypothesisTree;