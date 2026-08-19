import { useInvestigationStore } from "@/stores/investigationStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const HypothesisTree = () => {
    const { hypotheses, selectedHypothesisId, selectHypothesis, setStep, addFinding, addAction } = useInvestigationStore();
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (!hypotheses || hypotheses.length === 0) {
        return <div className="text-center py-12 text-muted-foreground">Нет гипотез для отображения</div>;
    }

    const handleConfirm = () => {
        if (selectedHypothesisId) {
            setStep(3);
            // Исправленный вызов addFinding – передаём объект
            addFinding({ type: "Гипотеза", value: selectedHypothesisId, comment: t("confirm_choice") });
            addAction(`${t("confirm_choice")} ${selectedHypothesisId}`);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold">{t("hypotheses_tree")}</h2>

            <div className="space-y-4">
                {hypotheses.map((hyp) => {
                    const isExpanded = expandedId === hyp.id;
                    const isSelected = selectedHypothesisId === hyp.id;

                    return (
                        <Card key={hyp.id} className={`border-l-4 ${isSelected ? 'border-primary' : 'border-muted'}`}>
                            <CardHeader
                                className="cursor-pointer flex flex-row items-start justify-between"
                                onClick={() => setExpandedId(isExpanded ? null : hyp.id)}
                            >
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <span>{hyp.title}</span>
                                        <span className="text-sm font-normal text-muted-foreground">(ID: {hyp.id})</span>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">{t("status")} {hyp.status}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </CardHeader>
                            {isExpanded && (
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-success flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {t("facts_for")}</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {hyp.evidence_for.map((fact, i) => <li key={i}>{fact}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-destructive flex items-center gap-1"><XCircle className="w-4 h-4" /> {t("facts_against")}</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {hyp.evidence_against.map((fact, i) => <li key={i}>{fact}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    {hyp.att_ck && <p><span className="font-medium">{t("attck")}</span> {hyp.att_ck.join(', ')}</p>}
                                    {hyp.llm_comment && <p className="text-sm text-muted-foreground">{t("llm_comment")} {hyp.llm_comment}</p>}
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
                <p className="font-medium">{t("select_hypothesis")}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {hypotheses.map((hyp) => (
                        <Button
                            key={hyp.id}
                            variant={selectedHypothesisId === hyp.id ? "default" : "outline"}
                            onClick={() => selectHypothesis(hyp.id)}
                            className="text-sm"
                        >
                            {hyp.id}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Button onClick={handleConfirm} disabled={!selectedHypothesisId}>{t("confirm_choice")}</Button>
                    <Button variant="outline" onClick={() => setStep(1)}>{t("back_to_context")}</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t("human_decision_caption")}</p>
            </div>
        </motion.div>
    );
};