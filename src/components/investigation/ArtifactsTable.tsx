import { useInvestigationStore } from "@/stores/investigationStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const ArtifactsTable = () => {
    const { artifacts, setStep, addFinding, addAction } = useInvestigationStore();
    const { t } = useTranslation();

    if (!artifacts) {
        return <div className="text-center py-12 text-muted-foreground">Нет артефактов</div>;
    }

    const rows = [
        { label: "IP для блокировки", value: artifacts.ips_to_block.join(', ') },
        { label: "Хэши", value: artifacts.hashes.join(', ') },
        { label: "Процессы", value: artifacts.processes.join(', ') },
        { label: "Пользователи", value: artifacts.users_to_investigate.join(', ') },
        { label: "Хосты", value: artifacts.hosts.join(', ') },
    ];

    const handleSaveArtifacts = () => {
        artifacts.ips_to_block.forEach(ip => addFinding({ type: "C2 IP", value: ip, comment: "Блокировка" }));
        artifacts.hashes.forEach(h => addFinding({ type: "Хэш", value: h, comment: "Блокировка" }));
        addAction(t("save_artifacts"));
    };

    const handleGenerateReport = () => {
        setStep(4);
        addAction(t("generate_report"));
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold">{t("response_preparation")}</h2>

            {artifacts.warning && (
                <div className="bg-warning/10 border border-warning/20 p-3 rounded text-warning text-sm">
                    <AlertTriangle className="inline w-4 h-4 mr-2" /> {artifacts.warning}
                </div>
            )}

            <Card>
                <CardHeader><CardTitle>{t("artifact_table")}</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 font-medium">Тип</th>
                                    <th className="text-left py-2 font-medium">Значение</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.label} className="border-b last:border-none">
                                        <td className="py-2 pr-4 font-medium">{row.label}</td>
                                        <td className="py-2 break-all">{row.value || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-4">
                <Button onClick={handleSaveArtifacts}>{t("save_artifacts")}</Button>
                <Button onClick={handleGenerateReport}>{t("generate_report")}</Button>
                <Button variant="outline" onClick={() => setStep(2)}>{t("back_to_hypotheses")}</Button>
            </div>
        </motion.div>
    );
};