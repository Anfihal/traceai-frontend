import { useInvestigationStore } from "@/stores/investigationStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle, Shield, Globe, Clock, User, Hash, Command } from "lucide-react";

export const ContextView = () => {
    const { context, setStep, addAction } = useInvestigationStore();
    const { t } = useTranslation();

    if (!context) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("context_error")}</p>
                <Button onClick={() => setStep(0)} className="mt-4">{t("retry")}</Button>
            </div>
        );
    }

    const handleGenerateHypotheses = () => {
        setStep(2);
        addAction(t("generate_hypotheses"));
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold">{t("context_collected")}</h2>
                <Button onClick={handleGenerateHypotheses}>{t("generate_hypotheses")}</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> {t("source")}</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p><span className="font-medium">IP:</span> {context.src.ip}:{context.src.port}</p>
                        <p><span className="font-medium">Хост:</span> {context.src.host_id}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> {t("target")}</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p><span className="font-medium">IP:</span> {context.dst.ip}:{context.dst.port}</p>
                        <p><span className="font-medium">Страна:</span> {context.dst.geo.country} (ASN: {context.dst.geo.asn})</p>
                        <p><span className="font-medium">Репутация:</span> <span className={`px-2 py-0.5 rounded text-xs ${context.rpt.verdict === 'malicious' ? 'bg-danger/20 text-danger' :
                            context.rpt.verdict === 'suspicious' ? 'bg-warning/20 text-warning' :
                                'bg-success/20 text-success'
                            }`}>{context.rpt.verdict}</span> (источник: {context.rpt.source})</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Детали</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p><Clock className="inline w-4 h-4 mr-2" />{t("time")} {context.ts}</p>
                    <p><span className="font-medium">{t("protocol")}</span> {context.proto} ({context.app_proto})</p>
                    <p><User className="inline w-4 h-4 mr-2" />{t("user_label")} {context.user}</p>
                    {context.sha256 && <p><Hash className="inline w-4 h-4 mr-2" />{t("hashes", { sha256: context.sha256, md5: context.md5 || 'N/A' })}</p>}
                    <p><span className="font-medium">{t("attck")}</span> {context.att_ck.join(', ')}</p>
                    <div className="bg-muted p-3 rounded">
                        <Command className="inline w-4 h-4 mr-2" />
                        <code className="text-sm break-all">{t("cmd_preview", { cmd: context.cmd.slice(0, 120) })}</code>
                    </div>
                    {context.event_type && <p><span className="font-medium">{t("event_type")}</span> {context.event_type}</p>}
                    <p>{t("neighbor_alerts_count", { count: context.neighbor_alerts?.length || 0 })}</p>
                    {context.historical_similar && <p className="text-sm text-muted-foreground">{t("historical_similar")} {context.historical_similar}</p>}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>{t("back_to_alert")}</Button>
                <Button onClick={handleGenerateHypotheses}>{t("generate_hypotheses")}</Button>
            </div>
        </motion.div>
    );
};