import { useTranslation } from "react-i18next";

export const DataTab = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("data_tab")}</h2>
            <p className="text-muted-foreground">{t("no_data")}</p>
        </div>
    );
};