import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const SearchTab = () => {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("search_filter")}</h2>
            <Input placeholder={t("search_placeholder")} value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && <p className="text-muted-foreground">{t("enter_query")}</p>}
        </div>
    );
};