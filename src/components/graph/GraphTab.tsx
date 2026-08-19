import { useTranslation } from "react-i18next";
import { useInvestigationStore } from "@/stores/investigationStore";

export const GraphTab = () => {
    const { t } = useTranslation();
    const { context } = useInvestigationStore();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("graph_view")}</h2>
            {context ? (
                <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                    Здесь будет 3D/2D граф связей
                </div>
            ) : (
                <p className="text-muted-foreground">{t("graph_info")}</p>
            )}
        </div>
    );
};