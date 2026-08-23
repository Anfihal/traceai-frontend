import { useEffect, useState } from 'react';
import { useHypotheses } from '@/hooks/useHypotheses';
import { useSelectHypothesis } from '@/hooks/useSelectHypothesis';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HypothesisTree = () => {
    const { hypotheses, step } = useInvestigationStore();
    const { mutate: generateHypotheses, isPending: isGenerating, error: generateError } = useHypotheses();
    const { mutate: selectHypothesis, isPending: isSelecting, error: selectError } = useSelectHypothesis();
    const [selectedId, setSelectedId] = useState<string | null>(null);

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

    if (isGenerating) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Генерация гипотез...</span>
            </div>
        );
    }

    if (generateError) {
        return (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                Ошибка генерации гипотез: {generateError.message}
                <button onClick={handleGenerate} className="ml-4 underline">Повторить</button>
            </div>
        );
    }

    if (!hypotheses || hypotheses.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Гипотезы ещё не сгенерированы.</p>
                <Button onClick={handleGenerate} className="mt-4">
                    Сгенерировать гипотезы
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Дерево гипотез</h3>
            <div className="space-y-4">
                {hypotheses.map((hyp) => (
                    <div
                        key={hyp.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedId === hyp.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                            }`}
                        onClick={() => setSelectedId(hyp.id)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-bold">{hyp.title}</h4>
                                <p className="text-sm text-muted-foreground">ID: {hyp.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${hyp.status === 'требует проверки'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {hyp.status}
                                </span>
                            </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm font-medium">Факты ЗА:</p>
                                <ul className="text-sm list-disc list-inside">
                                    {hyp.evidence_for.map((fact, i) => (
                                        <li key={i}>{fact}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Факты ПРОТИВ:</p>
                                <ul className="text-sm list-disc list-inside">
                                    {hyp.evidence_against.map((fact, i) => (
                                        <li key={i}>{fact}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {hyp.att_ck && hyp.att_ck.length > 0 && (
                            <div className="mt-2 text-sm">
                                <span className="font-medium">MITRE ATT&CK:</span>{' '}
                                {hyp.att_ck.join(', ')}
                            </div>
                        )}
                        {hyp.llm_comment && (
                            <div className="mt-2 text-sm bg-muted p-2 rounded">
                                <span className="font-medium">Комментарий LLM:</span> {hyp.llm_comment}
                            </div>
                        )}
                        {selectedId === hyp.id && (
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs text-primary">✓ Выбрано</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mt-6">
                <Button
                    onClick={handleSelect}
                    disabled={!selectedId || isSelecting}
                    className="px-6"
                >
                    {isSelecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Подтвердить выбор
                </Button>
                {selectedId && (
                    <span className="text-sm text-muted-foreground self-center">
                        Выбрана гипотеза: {hypotheses.find(h => h.id === selectedId)?.title}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <Button variant="outline" onClick={() => useInvestigationStore.getState().setStep(1)}>
                    ← Назад к контексту
                </Button>
            </div>
            {selectError && (
                <div className="text-destructive text-sm mt-2">
                    Ошибка выбора гипотезы: {selectError.message}
                </div>
            )}
        </div>
    );
};

export default HypothesisTree;