import { useState } from 'react';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { useTips } from '@/hooks/useTips';

interface Tip {
    title: string;
    description: string;
    action?: string;
}

export const TipsTab = () => {
    const { step } = useInvestigationStore();
    const [history, setHistory] = useState<{ step: number; tips: Tip[] }[]>([]);
    const { mutate: generateTips, isPending } = useTips();

    const handleGenerate = () => {
        generateTips(undefined, {
            onSuccess: (data: Tip[]) => {
                setHistory((prev) => [...prev, { step, tips: data }]);
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Библиотека подсказок</h3>
                <Button onClick={handleGenerate} disabled={isPending}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isPending ? 'animate-spin' : ''}`} />
                    Сгенерировать для текущего шага
                </Button>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                    <Lightbulb className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                    <p>Подсказки будут появляться здесь после генерации.</p>
                    <p className="text-sm">Нажмите кнопку выше, чтобы начать.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.slice().reverse().map((entry, idx) => (
                        <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Шаг {entry.step}</span>
                                <span className="text-xs text-zinc-500">{entry.tips.length} подсказок</span>
                            </div>
                            {entry.tips.map((tip, i) => (
                                <div key={i} className="text-sm p-2 bg-white dark:bg-zinc-800 rounded mt-1">
                                    <span className="font-medium">{tip.title}</span>: {tip.description}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};