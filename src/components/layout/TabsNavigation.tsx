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
    const tabs = Array.isArray(tabsRaw) ? tabsRaw : ["Расследование", "Журнал находок", "Подсказки", "Чат-ассистент", "Граф связей", "Данные"];

    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <div className="flex justify-center">
                <TabsList className="flex flex-wrap justify-center gap-1 h-auto p-1 rounded-lg bg-muted/50 max-w-full">
                    {tabs.map((label) => (
                        <TabsTrigger
                            key={label}
                            value={label}
                            className="h-9 px-3 text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow"
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