import { ThemeProvider } from "next-themes";
import { MainLayout } from "./components/layout/MainLayout";
import { StepIndicator } from "./components/investigation/StepIndicator";
import { TabsNavigation } from "./components/layout/TabsNavigation";
import { TabsContent } from "@/components/ui/tabs";
import { AlertCard } from "./components/investigation/AlertCard";
import { ContextView } from "./components/investigation/ContextView";
import { HypothesisTree } from "./components/investigation/HypothesisTree";
import { ArtifactsTable } from "./components/investigation/ArtifactsTable";
import { ReportView } from "./components/investigation/ReportView";
import { FindingsLog } from "./components/findings/FindingsLog";
import { SearchTab } from "./components/search/SearchTab";
import { TipsTab } from "./components/tips/TipsTab";
import { ChatAssistant } from "./components/chat/ChatAssistant";
import { GraphTab } from "./components/graph/GraphTab";
import { DataTab } from "./components/data/DataTab";
import { useInvestigationStore } from "./stores/investigationStore";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSession } from "./hooks/useSession";

function App() {
  const { step, alert, setAlert, sessionId } = useInvestigationStore();
  const { t } = useTranslation();
  const tabs = t("tabs", { returnObjects: true }) as string[];
  const [activeTab, setActiveTab] = useState(tabs[0] || "Расследование");

  const { mutate: startSession, isPending: isSessionLoading } = useSession();

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    if (!alert && sessionId) {
      setAlert({
        id: "alert-001",
        rule: "Подозрительный запуск powershell с сетевым соединением",
        user: "ivanov",
        src_ip: "10.0.0.45",
        dst_ip: "185.130.5.253",
        host: { name: "WS-123", groups: ["Workstations"] },
        cmd: "powershell -enc ...",
      });
    }
  }, [alert, sessionId, setAlert]);

  const renderInvestigationContent = () => {
    switch (step) {
      case 0: return <AlertCard />;
      case 1: return <ContextView />;
      case 2: return <HypothesisTree />;
      case 3: return <ArtifactsTable />;
      case 4: return <ReportView />;
      default: return null;
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка сессии...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <StepIndicator />
          <div className="mt-6">
            <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab}>
              <TabsContent value={tabs[0]}>{renderInvestigationContent()}</TabsContent>
              <TabsContent value={tabs[1]}><FindingsLog /></TabsContent>
              <TabsContent value={tabs[2]}><SearchTab /></TabsContent>
              <TabsContent value={tabs[3]}><TipsTab /></TabsContent>
              <TabsContent value={tabs[4]}><ChatAssistant /></TabsContent>
              <TabsContent value={tabs[5]}><GraphTab /></TabsContent>
              <TabsContent value={tabs[6]}><DataTab /></TabsContent>
            </TabsNavigation>
          </div>
        </div>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;