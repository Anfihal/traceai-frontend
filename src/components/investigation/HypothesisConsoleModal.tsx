import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Copy, Terminal } from 'lucide-react';
import { Hypothesis } from '@/types';
import { toast } from 'sonner';

interface HypothesisConsoleModalProps {
    hypothesis: Hypothesis;
    onClose: () => void;
}

export const HypothesisConsoleModal: React.FC<HypothesisConsoleModalProps> = ({
    hypothesis,
    onClose,
}) => {
    const { t } = useTranslation();
    const json = JSON.stringify(hypothesis, null, 2);

    const copyJson = () => {
        navigator.clipboard.writeText(json);
        toast.success(t('chat.toasts.copied'));
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#0d0e13] rounded-xl border border-[#292b34] shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Заголовок */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#292b34] shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <Terminal size={16} className="text-[#20f0e7] shrink-0" />
                        <span className="text-sm font-medium text-[#f7f8fa]">
                            {t('hypotheses.consoleTitle')}
                        </span>
                        <span className="text-xs text-[#a3a6af] font-mono truncate">
                            {hypothesis.id}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={copyJson}
                            className="text-[#a3a6af] hover:text-[#20f0e7] transition-colors p-1"
                            title={t('hypotheses.copyJson')}
                        >
                            <Copy size={16} />
                        </button>
                        <button
                            onClick={onClose}
                            className="text-[#a3a6af] hover:text-[#ff4d4d] transition-colors p-1"
                            title={t('hypotheses.close')}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Тело — терминал */}
                <div className="flex-1 overflow-auto bg-[#0a0d12] font-mono text-xs">
                    <pre className="p-4 text-[#20f0e7] leading-relaxed whitespace-pre-wrap break-words">
                        <span className="text-[#a3a6af]">$ </span>
                        <span className="text-[#f7f8fa]">
                            cat hypothesis_{hypothesis.id}.json
                        </span>
                        {'\n\n'}
                        <span className="text-[#f7f8fa]">{json}</span>
                    </pre>
                </div>

                {/* Футер */}
                <div className="px-5 py-3 border-t border-[#292b34] flex justify-between items-center shrink-0">
                    <span className="text-xs text-[#a3a6af] font-mono">
                        {json.length} bytes
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-sm rounded-full bg-[#20f0e7] text-[#06100f] hover:bg-[#0bd6cf] transition-colors"
                    >
                        {t('hypotheses.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};