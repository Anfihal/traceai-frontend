import { useInvestigationStore } from "@/stores/investigationStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export const ReportView = () => {
    const { report, setStep, addAction } = useInvestigationStore();
    const { t } = useTranslation();

    const handleDownload = () => {
        if (report) {
            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'incident_report.txt';
            a.click();
            URL.revokeObjectURL(url);
            addAction(t("export_report"));
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold">{t("report")}</h2>

            <Card>
                <CardContent className="p-6 whitespace-pre-wrap font-mono text-sm bg-muted/30 rounded-lg">
                    {report || 'Отчёт ещё не сгенерирован.'}
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-4">
                <Button onClick={handleDownload} disabled={!report}>{t("download_report")}</Button>
                <Button variant="outline" onClick={() => setStep(3)}>{t("back_to_response")}</Button>
            </div>
        </motion.div>
    );
};