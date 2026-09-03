import { useState, useEffect } from 'react';
import { useTips } from '@/hooks/useTips';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Lightbulb, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tip {
    title: string;
    description: string;
    action?: string;
}

export const ContextualTips = () => {
    const { step } = useInvestigationStore();
    const [tips, setTips] = useState<Tip[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const { mutate: generateTips, isPending, data } = useTips();

    useEffect(() => {
        generateTips();
    }, [step]);

    useEffect(() => {
        if (data) setTips(data);
    }, [data]);

    if (isPending) {
        return (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 animate-pulse" />
                <span className="text-sm text-zinc-500">Генерация подсказок…</span>
            </div>
        );
    }

    if (!tips || tips.length === 0) return null;

    return (
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30 overflow-hidden">
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="font-medium text-sm">Подсказки для этапа {step}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                            e.stopPropagation();
                            generateTips();
                        }}
                        title="Обновить подсказки"
                    >
                        <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
                    </Button>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                    {tips.map((tip, idx) => (
                        <div key={idx} className="bg-white dark:bg-zinc-900/50 rounded-lg p-3 border border-amber-100 dark:border-amber-800/20">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800/50 text-xs font-bold text-amber-800 dark:text-amber-300">
                                    {idx + 1}
                                </span>
                                {tip.title}
                            </h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{tip.description}</p>
                            {tip.action && (
                                <div className="mt-2">
                                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full text-amber-800 dark:text-amber-300">
                                        → {tip.action}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};