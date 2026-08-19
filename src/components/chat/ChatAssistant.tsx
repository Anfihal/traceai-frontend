import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ChatAssistant = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<{ user: string; assistant: string }[]>([]);

    const questions = t("questions", { returnObjects: true }) as string[];

    const handleQuestion = (q: string) => {
        setMessages([...messages, { user: q, assistant: "Ответ ИИ пока не реализован" }]);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("chat_assistant")}</h2>
            <div className="flex flex-wrap gap-2">
                {questions.map((q) => (
                    <Button key={q} variant="outline" size="sm" onClick={() => handleQuestion(q)}>
                        {q}
                    </Button>
                ))}
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {messages.map((m, i) => (
                    <div key={i} className="border-b pb-2">
                        <p><span className="font-semibold">{t("you")}:</span> {m.user}</p>
                        <p><span className="font-semibold">{t("assistant")}:</span> {m.assistant}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};