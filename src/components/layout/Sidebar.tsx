import { useTranslation } from 'react-i18next';
import { useAppStore, useLLMStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Upload, RefreshCw, Globe, Users, Database, Cpu, X, Book, BookOpen } from 'lucide-react';

interface SidebarProps {
    onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
    const { t, i18n } = useTranslation();
    const { role, setRole, language, setLanguage } = useAppStore();
    const { ragMode, toggleRag } = useLLMStore();

    const handleLanguageChange = (lng: string) => {
        setLanguage(lng);
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex flex-col h-full p-4 sm:p-5 overflow-y-auto">
            {/* Кнопка закрытия для мобилок */}
            <div className="flex justify-end sm:hidden mb-3">
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={onClose}>
                    <X className="h-6 w-6" />
                </Button>
            </div>

            <div className="space-y-5 flex-1">
                {/* Демо-кейс */}
                <section>
                    <h2 className="text-base sm:text-lg font-semibold">{t('demo_case')}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{t('alert_desc')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('user_not_admin')}</p>
                    <p className="text-xs text-muted-foreground">{t('neighbor_alerts')}</p>
                    <p className="text-xs text-muted-foreground">{t('mitre')}</p>
                </section>

                {/* Язык */}
                <section className="border-t pt-4">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4" /> {t('language')}
                    </label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-full mt-1 h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ru">Русский</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                    </Select>
                </section>

                {/* Загрузка данных */}
                <section className="border-t pt-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                        <Database className="w-4 h-4" /> {t('load_data')}
                    </h3>
                    <Button variant="outline" className="w-full mt-2 h-11" asChild>
                        <label>
                            <Upload className="mr-2 h-4 w-4" /> {t('upload_json')}
                            <input type="file" accept=".json" className="hidden" />
                        </label>
                    </Button>
                </section>

                {/* Роль */}
                <section className="border-t pt-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" /> {t('role')}
                    </h3>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-full mt-1 h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="analyst">{t('analyst')}</SelectItem>
                            <SelectItem value="supervisor">{t('supervisor')}</SelectItem>
                            <SelectItem value="admin">{t('admin')}</SelectItem>
                        </SelectContent>
                    </Select>
                </section>

                {/* LLM */}
                <section className="border-t pt-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                        <Cpu className="w-4 h-4" /> {t('llm_settings')}
                    </h3>
                    <Select>
                        <SelectTrigger className="w-full mt-1 h-11">
                            <SelectValue placeholder="Выберите модель" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ollama-llama3">Ollama - Llama3</SelectItem>
                            <SelectItem value="openai-gpt4">OpenAI GPT-4</SelectItem>
                        </SelectContent>
                    </Select>
                </section>

                {/* RAG – переключатель в виде книги */}
                <section className="border-t pt-4">
                    <button
                        onClick={toggleRag}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        {ragMode ? (
                            <BookOpen className="h-6 w-6 text-primary transition-all duration-300 transform rotate-0" />
                        ) : (
                            <Book className="h-6 w-6 text-muted-foreground transition-all duration-300 transform -rotate-12" />
                        )}
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{t('rag_mode')}</span>
                            <span className="text-xs text-muted-foreground">
                                {ragMode ? t('rag_on') : t('rag_off')}
                            </span>
                        </div>
                    </button>
                    <p className="text-xs text-muted-foreground mt-1 pl-2">{t('rag_description')}</p>
                </section>

                {/* Кнопка рестарта */}
                <div className="mt-auto pt-4 border-t">
                    <Button variant="outline" className="w-full h-11" onClick={() => window.location.reload()}>
                        <RefreshCw className="mr-2 h-4 w-4" /> {t('restart_investigation')}
                    </Button>
                </div>
            </div>
        </div>
    );
};