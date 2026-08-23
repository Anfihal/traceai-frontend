import { useReport } from '@/hooks/useReport';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ReportView = () => {
    const { report, setStep } = useInvestigationStore(); // убрали step
    const { mutate: generateReport, isPending, error } = useReport();

    const handleGenerate = () => {
        generateReport();
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Генерация отчёта...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                Ошибка генерации отчёта: {error.message}
                <button onClick={handleGenerate} className="ml-4 underline">Повторить</button>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Отчёт ещё не сформирован.</p>
                <Button onClick={handleGenerate} className="mt-4">
                    Сформировать отчёт
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Отчёт по инциденту</h3>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                {report}
            </div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                    ← Назад к реагированию
                </Button>
                <Button onClick={() => {
                    const blob = new Blob([report], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'incident_report.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                }}>
                    Скачать отчёт
                </Button>
            </div>
        </div>
    );
};