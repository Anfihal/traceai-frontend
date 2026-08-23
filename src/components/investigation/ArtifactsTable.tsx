import { useEffect } from 'react';
import { useArtifacts } from '@/hooks/useArtifacts';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ArtifactsTable = () => {
    const { artifacts, step, setStep } = useInvestigationStore();
    const { mutate: getArtifacts, isPending, error } = useArtifacts();

    useEffect(() => {
        if (step === 3 && !artifacts && !isPending) {
            getArtifacts();
        }
    }, [step, artifacts, isPending, getArtifacts]);

    const handleRefresh = () => {
        getArtifacts();
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Загрузка артефактов...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                Ошибка получения артефактов: {error.message}
                <button onClick={handleRefresh} className="ml-4 underline">Повторить</button>
            </div>
        );
    }

    if (!artifacts) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Артефакты ещё не подготовлены.</p>
                <Button onClick={handleRefresh} className="mt-4">
                    Получить артефакты
                </Button>
            </div>
        );
    }

    const hasArtifacts = artifacts.ips_to_block?.length > 0 || artifacts.hashes?.length > 0;

    if (!hasArtifacts) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Для выбранной гипотезы артефакты не требуются.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Подготовка реагирования</h3>

            {artifacts.warning && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                    ⚠️ {artifacts.warning}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-muted">
                            <th className="text-left p-2 border">Тип</th>
                            <th className="text-left p-2 border">Значения</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artifacts.ips_to_block && artifacts.ips_to_block.length > 0 && (
                            <tr>
                                <td className="p-2 border font-medium">IP для блокировки</td>
                                <td className="p-2 border">
                                    {artifacts.ips_to_block.map((ip, idx) => (
                                        <code key={idx} className="bg-muted px-1 rounded mr-1">{ip}</code>
                                    ))}
                                </td>
                            </tr>
                        )}
                        {artifacts.hashes && artifacts.hashes.length > 0 && (
                            <tr>
                                <td className="p-2 border font-medium">Хэши</td>
                                <td className="p-2 border">
                                    {artifacts.hashes.map((hash, idx) => (
                                        <code key={idx} className="bg-muted px-1 rounded mr-1 text-xs">{hash}</code>
                                    ))}
                                </td>
                            </tr>
                        )}
                        {artifacts.processes && artifacts.processes.length > 0 && (
                            <tr>
                                <td className="p-2 border font-medium">Процессы</td>
                                <td className="p-2 border">
                                    {artifacts.processes.map((proc, idx) => (
                                        <span key={idx} className="bg-muted px-1 rounded mr-1">{proc}</span>
                                    ))}
                                </td>
                            </tr>
                        )}
                        {artifacts.users_to_investigate && artifacts.users_to_investigate.length > 0 && (
                            <tr>
                                <td className="p-2 border font-medium">Учётные записи</td>
                                <td className="p-2 border">
                                    {artifacts.users_to_investigate.map((user, idx) => (
                                        <span key={idx} className="bg-muted px-1 rounded mr-1">{user}</span>
                                    ))}
                                </td>
                            </tr>
                        )}
                        {artifacts.hosts && artifacts.hosts.length > 0 && (
                            <tr>
                                <td className="p-2 border font-medium">Хосты</td>
                                <td className="p-2 border">
                                    {artifacts.hosts.map((host, idx) => (
                                        <span key={idx} className="bg-muted px-1 rounded mr-1">{host}</span>
                                    ))}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-4 mt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                    ← Назад к гипотезам
                </Button>
                <Button onClick={() => setStep(4)}>
                    Перейти к отчёту →
                </Button>
            </div>
        </div>
    );
};