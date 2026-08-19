import { useInvestigationStore } from "@/stores/investigationStore";
import { useTranslation } from "react-i18next";

export const FindingsLog = () => {
    const { findings } = useInvestigationStore();
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("findings_log")}</h2>
            {findings.length === 0 ? (
                <p className="text-muted-foreground">{t("no_findings")}</p>
            ) : (
                <div className="space-y-2">
                    {findings.map((f, i) => (
                        <div key={i} className="border-l-2 border-primary pl-3 py-1">
                            <span className="text-xs text-muted-foreground">[{f.time}]</span>
                            <span className="font-medium ml-2">{f.type}:</span>
                            <span className="ml-1">{f.value}</span>
                            {f.comment && <span className="text-sm text-muted-foreground ml-2">— {f.comment}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};