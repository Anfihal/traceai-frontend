import { useTranslation } from "react-i18next";
import { useInvestigationStore } from "@/stores/investigationStore";

export const TipsTab = () => {
    const { t } = useTranslation();
    const { step } = useInvestigationStore();

    const tipKey = `step${step}_tip`;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("next_steps")}</h2>
            <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm">{t(tipKey)}</p>
            </div>
            <div className="space-y-2 text-sm">
                <p className="font-semibold">{t("general_tips")}</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>{t("tip1")}</li>
                    <li>{t("tip2")}</li>
                    <li>{t("tip3")}</li>
                </ul>
            </div>
        </div>
    );
};