import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

interface TabsNavigationProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (value: string) => void;
}

export const TabsNavigation = ({ children, activeTab, onTabChange }: TabsNavigationProps) => {
    const { t } = useTranslation();
    const tabsRaw = t("tabs", { returnObjects: true });
    const tabs = Array.isArray(tabsRaw) ? tabsRaw : ["Расследование", "Журнал находок", "Поиск", "Подсказки", "Чат-ассистент", "Граф связей", "Данные"];

    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <TabsList className="inline-flex w-max min-w-full sm:grid sm:grid-cols-4 md:grid-cols-7 gap-1 h-auto p-1">
                    {tabs.map((label) => (
                        <TabsTrigger
                            key={label}
                            value={label}
                            className="h-11 px-3 text-xs sm:text-sm whitespace-nowrap"
                        >
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            {children}
        </Tabs>
    );
};