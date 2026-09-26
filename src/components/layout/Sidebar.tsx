import { useTranslation } from 'react-i18next';
import { useInvestigationStore } from '@/stores/investigationStore';
import { useAppStore } from '@/stores/appStore';
import { useLLMStore } from '@/stores/llmStore';
import { useAvailableProviders } from '@/hooks/useAvailableProviders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
    Book, BookOpen, GripVertical, ChevronLeft, ChevronRight, Languages,
    CheckCircle2, XCircle, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
    Plus, RefreshCw, Trash2,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
    onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
    const { t, i18n } = useTranslation();

    const {
        language, setLanguage, role, setRole,
        sidebarPosition, setSidebarPosition,
        sidebarWidth, sidebarHeight, setSidebarSize,
        isSidebarOpen, toggleSidebar,
    } = useAppStore();

    const {
        alert, setAlert, setStep, setContext, setHypotheses,
        setArtifacts, setReport, setSelectedHypothesisId,
    } = useInvestigationStore();

    const {
        ragMode, setRagMode,
        customProviders, addCustomProvider, removeCustomProvider,
        selectedProviderId, setSelectedProviderId,
    } = useLLMStore();

    const {
        providers: ollamaProviders,
        loading: ollamaLoading,
        error: ollamaError,
        reload: reloadOllama,
    } = useAvailableProviders();

    const allProviders = useMemo(
        () => [...(ollamaProviders || []), ...(customProviders || [])],
        [ollamaProviders, customProviders]
    );

    const [editAlert, setEditAlert] = useState({
        src_ip: alert?.src_ip || '10.0.0.45',
        dst_ip: alert?.dst_ip || '185.130.5.253',
        user: alert?.user || 'ivanov',
        hostname: alert?.host?.name || 'WS-123',
        cmd: alert?.cmd || 'powershell -enc ...',
    });
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // Форма Custom-провайдера
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newModel, setNewModel] = useState('');
    const [newBaseUrl, setNewBaseUrl] = useState('');
    const [newApiKey, setNewApiKey] = useState('');

    const handleAddCustomProvider = () => {
        const name = newName.trim();
        const model = newModel.trim();
        const baseUrl = newBaseUrl.trim();
        const apiKey = newApiKey.trim();

        if (!name || !model || !baseUrl) {
            window.alert('Заполните название, модель и Base URL');
            return;
        }

        const provider = {
            id: `custom-${Date.now()}`,
            name,
            type: 'custom' as const,
            model,
            baseUrl,
            apiKey: apiKey || undefined,
        };

        addCustomProvider(provider);
        setSelectedProviderId(provider.id);

        setNewName('');
        setNewModel('');
        setNewBaseUrl('');
        setNewApiKey('');
        setShowAddForm(false);
    };

    // Автовыбор первой модели
    useEffect(() => {
        if (!selectedProviderId && allProviders.length > 0) {
            setSelectedProviderId(allProviders[0].id);
        }
    }, [allProviders, selectedProviderId, setSelectedProviderId]);

    // Перетаскивание
    const panelRef = useRef<HTMLDivElement>(null);
    const dragOffset = useRef({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // Ресайз
    const [isResizing, setIsResizing] = useState(false);
    const resizeDirection = useRef<'left' | 'right' | 'top' | 'bottom' | null>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const startSize = useRef({ width: 0, height: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && panelRef.current) {
                const panel = panelRef.current;
                const newX = e.clientX - dragOffset.current.x;
                const newY = e.clientY - dragOffset.current.y;
                panel.style.left = `${newX}px`;
                panel.style.top = `${newY}px`;
                setSidebarPosition('left');
            }
            if (isResizing && panelRef.current) {
                let newWidth = startSize.current.width;
                let newHeight = startSize.current.height;
                const dir = resizeDirection.current;

                if (dir === 'right' || dir === 'left') {
                    const dx = e.clientX - startPos.current.x;
                    newWidth = dir === 'right'
                        ? Math.min(Math.max(startSize.current.width + dx, 200), 800)
                        : Math.min(Math.max(startSize.current.width - dx, 200), 800);
                    setSidebarSize(newWidth, startSize.current.height);
                } else if (dir === 'bottom' || dir === 'top') {
                    const dy = e.clientY - startPos.current.y;
                    newHeight = dir === 'bottom'
                        ? Math.min(Math.max(startSize.current.height + dy, 200), 600)
                        : Math.min(Math.max(startSize.current.height - dy, 200), 600);
                    setSidebarSize(startSize.current.width, newHeight);
                }
            }
        };
        const handleMouseUp = () => {
            if (isDragging) setIsDragging(false);
            if (isResizing) setIsResizing(false);
        };
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, setSidebarPosition, setSidebarSize]);

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        const panel = panelRef.current;
        if (!panel) return;
        const rect = panel.getBoundingClientRect();
        dragOffset.current.x = e.clientX - rect.left;
        dragOffset.current.y = e.clientY - rect.top;
        setIsDragging(true);
        panel.style.transform = 'none';
        panel.style.left = `${rect.left}px`;
        panel.style.top = `${rect.top}px`;
    };

    const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'right' | 'top' | 'bottom') => {
        e.preventDefault();
        const panel = panelRef.current;
        if (!panel) return;
        const rect = panel.getBoundingClientRect();
        startPos.current = { x: e.clientX, y: e.clientY };
        startSize.current = { width: rect.width, height: rect.height };
        resizeDirection.current = direction;
        setIsResizing(true);
    };

    const updateAlertAndReset = (newAlertData: Partial<typeof editAlert>) => {
        const updated = { ...editAlert, ...newAlertData };
        setEditAlert(updated);
        const newAlert = {
            id: 'alert-001',
            rule: 'Подозрительный запуск powershell с сетевым соединением',
            user: updated.user,
            src_ip: updated.src_ip,
            dst_ip: updated.dst_ip,
            host: { name: updated.hostname, groups: ['Workstations'] },
            cmd: updated.cmd,
        };
        setAlert(newAlert);
        setStep(0);
        setContext(null as any);
        setHypotheses(null as any);
        setSelectedHypothesisId(null as any);
        setArtifacts(null as any);
        setReport(null as any);
        onClose?.();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target?.result;
            if (!content) return;
            if (file.type === 'application/json') {
                try {
                    const json = JSON.parse(content as string);
                    const newData = {
                        src_ip: json.src_ip || editAlert.src_ip,
                        dst_ip: json.dst_ip || editAlert.dst_ip,
                        user: json.user || editAlert.user,
                        hostname: json.host?.name || editAlert.hostname,
                        cmd: json.cmd || editAlert.cmd,
                    };
                    updateAlertAndReset(newData);
                } catch (err) {
                    console.error('Ошибка парсинга JSON:', err);
                }
            } else if (file.type.startsWith('text/')) {
                updateAlertAndReset({ cmd: content as string });
            } else if (file.type.startsWith('image/')) {
                const readerImg = new FileReader();
                readerImg.onload = (e2) => setUploadedImage(e2.target?.result as string);
                readerImg.readAsDataURL(file);
            }
        };
        if (file.type === 'application/json' || file.type.startsWith('text/')) {
            reader.readAsText(file);
        } else {
            const readerImg = new FileReader();
            readerImg.onload = (e2) => setUploadedImage(e2.target?.result as string);
            readerImg.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handlePositionChange = (pos: 'left' | 'right' | 'top' | 'bottom') => {
        setSidebarPosition(pos);
        if (panelRef.current) {
            panelRef.current.style.left = '';
            panelRef.current.style.top = '';
            panelRef.current.style.transform = '';
        }
    };

    const toggleRag = () => setRagMode(!ragMode);
    const isMobile = window.innerWidth < 640;
    const handleLanguageChange = (lang: string) => {
        setLanguage(lang as any);
        i18n.changeLanguage(lang);
    };

    const selectedProvider = allProviders.find((p) => p.id === selectedProviderId);

    return (
        <div
            ref={panelRef}
            className={`sidebar-panel ${sidebarPosition} ${!isSidebarOpen ? 'collapsed' : ''}`}
            style={{
                width: isMobile ? '100%' : sidebarPosition === 'left' || sidebarPosition === 'right' ? sidebarWidth : 'auto',
                height: isMobile ? '100%' : sidebarPosition === 'top' || sidebarPosition === 'bottom' ? sidebarHeight : 'auto',
                maxHeight: isMobile ? '100%' : '80vh',
            }}
        >
            {!isMobile && (
                <>
                    {(sidebarPosition === 'left' || sidebarPosition === 'right') && (
                        <div
                            className={`resize-handle ${sidebarPosition === 'right' ? 'resize-left' : 'resize-right'}`}
                            onMouseDown={(e) => handleResizeStart(e, sidebarPosition === 'right' ? 'left' : 'right')}
                            title="Перетащите, чтобы изменить ширину"
                        />
                    )}
                    {(sidebarPosition === 'top' || sidebarPosition === 'bottom') && (
                        <div
                            className={`resize-handle ${sidebarPosition === 'bottom' ? 'resize-top' : 'resize-bottom'}`}
                            onMouseDown={(e) => handleResizeStart(e, sidebarPosition === 'bottom' ? 'top' : 'bottom')}
                            title="Перетащите, чтобы изменить высоту"
                        />
                    )}
                </>
            )}

            {/* Верхняя панель */}
            <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0 bg-background">
                <div className="flex items-center gap-2">
                    <div className="drag-handle" onMouseDown={handleDragStart} title="Перетащите панель">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="h-8 w-8"
                        title={isSidebarOpen ? 'Свернуть панель' : 'Развернуть панель'}
                    >
                        {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-auto h-8 text-xs border-0 bg-transparent">
                            <SelectValue placeholder="Язык" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ru"><span className="flex items-center gap-2"><Languages className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">RU</span><span>Русский</span></span></SelectItem>
                            <SelectItem value="en"><span className="flex items-center gap-2"><Languages className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">EN</span><span>English</span></span></SelectItem>
                            <SelectItem value="de"><span className="flex items-center gap-2"><Languages className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">DE</span><span>Deutsch</span></span></SelectItem>
                            <SelectItem value="fr"><span className="flex items-center gap-2"><Languages className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">FR</span><span>Français</span></span></SelectItem>
                            <SelectItem value="es"><span className="flex items-center gap-2"><Languages className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">ES</span><span>Español</span></span></SelectItem>
                            <SelectItem value="zh"><span className="flex items-center gap-2"><Languages className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">ZH</span><span>中文</span></span></SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="rag-book-wrapper flex items-center gap-1" onClick={toggleRag} title={ragMode ? 'Выключить RAG' : 'Включить RAG'}>
                        <div className={`rag-book-icon ${ragMode ? 'open' : 'closed'}`}>
                            {ragMode ? <BookOpen className="h-5 w-5 text-primary" /> : <Book className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">RAG</span>
                    </div>
                </div>
            </div>

            {/* Контент */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-background">
                <section>
                    <h3 className="text-md font-semibold mb-2">{t('demo_case', 'Демо-кейс')}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{t('alert_desc', 'Алерт: подозрительный powershell с base64, соединение на внешний IP 185.130.5.253')}</p>
                        <p>{t('user_not_admin', 'Пользователь: ivanov (не администратор)')}</p>
                        <p>{t('neighbor_alerts', 'Рядом другие срабатывания на те же C2')}</p>
                        <p>{t('mitre', 'MITRE ATT&CK: T1059.001, T1071')}</p>
                    </div>
                </section>

                <section className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-2">{t('edit_demo_case', 'Редактировать демо-кейс')}</h4>
                    <div className="space-y-3">
                        <div><label className="text-sm font-medium">{t('src_ip', 'Src IP')}</label><Input value={editAlert.src_ip} onChange={(e) => setEditAlert({ ...editAlert, src_ip: e.target.value })} /></div>
                        <div><label className="text-sm font-medium">{t('dst_ip', 'Dst IP')}</label><Input value={editAlert.dst_ip} onChange={(e) => setEditAlert({ ...editAlert, dst_ip: e.target.value })} /></div>
                        <div><label className="text-sm font-medium">{t('user', 'User')}</label><Input value={editAlert.user} onChange={(e) => setEditAlert({ ...editAlert, user: e.target.value })} /></div>
                        <div><label className="text-sm font-medium">{t('hostname', 'Hostname')}</label><Input value={editAlert.hostname} onChange={(e) => setEditAlert({ ...editAlert, hostname: e.target.value })} /></div>
                        <div>
                            <label className="text-sm font-medium">{t('command', 'Command')}</label>
                            <textarea className="w-full border rounded p-2 text-sm" rows={3} value={editAlert.cmd} onChange={(e) => setEditAlert({ ...editAlert, cmd: e.target.value })} />
                        </div>
                        <Button onClick={() => updateAlertAndReset({})} className="w-full" title="Применить изменения">
                            {t('apply_changes', 'Применить изменения')}
                        </Button>
                    </div>
                </section>

                <section className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-2">{t('upload_file', 'Загрузить файл')}</h4>
                    <input type="file" accept=".json,.txt,.png,.jpg,.jpeg,.gif,.svg" onChange={handleFileUpload} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" title="Загрузите JSON, текстовый файл или изображение" />
                    <p className="text-xs text-muted-foreground mt-1">{t('supported_files', 'Поддерживаются JSON, текст, изображения. JSON обновит все поля.')}</p>
                    {uploadedImage && (
                        <div className="mt-2">
                            <img src={uploadedImage} alt="Загруженное изображение" className="max-w-full h-auto border rounded" />
                        </div>
                    )}
                </section>

                <section className="border-t pt-4">
                    <label className="text-sm font-medium">{t('role', 'Роль')}</label>
                    <Select value={role} onValueChange={(val) => setRole(val as any)}>
                        <SelectTrigger><SelectValue placeholder={t('role', 'Роль')} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="analyst">{t('analyst', 'Аналитик')}</SelectItem>
                            <SelectItem value="supervisor">{t('supervisor', 'Руководитель')}</SelectItem>
                            <SelectItem value="admin">{t('admin', 'Администратор')}</SelectItem>
                        </SelectContent>
                    </Select>
                </section>

                <section className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-2">{t('integration_status', 'Статус интеграций')}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center gap-2"><span>SIEM:</span><CheckCircle2 className="h-4 w-4 text-[#20f0e7]" /><span>{t('connected', 'Подключено')}</span></p>
                        <p className="flex items-center gap-2"><span>EDR:</span><CheckCircle2 className="h-4 w-4 text-[#20f0e7]" /><span>{t('connected', 'Подключено')}</span></p>
                        <p className="flex items-center gap-2"><span>{t('reputation', 'Репутация')}:</span><CheckCircle2 className="h-4 w-4 text-[#20f0e7]" /><span>{t('connected', 'Подключено')}</span></p>
                        <p className="flex items-center gap-2"><span>{t('vector_memory', 'Векторная память')}:</span><CheckCircle2 className="h-4 w-4 text-[#20f0e7]" /><span>{t('connected', 'Подключено')}</span></p>
                        <p className="flex items-center gap-2">
                            <span>LLM:</span>
                            {selectedProvider ? <CheckCircle2 className="h-4 w-4 text-[#20f0e7]" /> : <XCircle className="h-4 w-4 text-[#ff4d4d]" />}
                            <span>{selectedProvider?.name || t('not_selected', 'Не выбрана')}</span>
                        </p>
                    </div>
                </section>

                {/* Настройки LLM */}
                <section className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold">{t('llm_settings', 'Настройки LLM')}</h4>
                        <button type="button" onClick={reloadOllama} className="text-muted-foreground hover:text-foreground transition-colors" title="Обновить список моделей Ollama">
                            <RefreshCw className={`h-3.5 w-3.5 ${ollamaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {ollamaLoading && allProviders.length === 0 ? (
                        <div className="text-xs text-muted-foreground border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md p-3">Загрузка моделей...</div>
                    ) : ollamaError && allProviders.length === 0 ? (
                        <div className="border border-dashed border-red-300 dark:border-red-800 rounded-md p-3 text-xs text-red-500 space-y-1">
                            <div>Не удалось загрузить модели Ollama: {ollamaError}</div>
                            <button type="button" onClick={reloadOllama} className="underline hover:no-underline">Повторить</button>
                        </div>
                    ) : allProviders.length > 0 ? (
                        <Select value={selectedProviderId || ''} onValueChange={setSelectedProviderId}>
                            <SelectTrigger><SelectValue placeholder={t('select_llm', 'Выберите модель')} /></SelectTrigger>
                            <SelectContent>
                                {ollamaProviders.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        <span className="flex flex-col">
                                            <span className="font-medium">{p.name}</span>
                                            <span className="text-xs text-muted-foreground font-mono">{p.model}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                                {customProviders && customProviders.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        <span className="flex flex-col">
                                            <span className="font-medium">{p.name}</span>
                                            <span className="text-xs text-muted-foreground font-mono">custom · {p.model}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md p-3 text-xs text-muted-foreground space-y-2">
                            <div>Нет установленных моделей Ollama.</div>
                            <code className="block text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                docker compose exec ollama ollama pull llama3
                            </code>
                        </div>
                    )}

                    {/* Список custom с удалением */}
                    {customProviders && customProviders.length > 0 && (
                        <div className="mt-3 space-y-1">
                            {customProviders.map((p) => (
                                <div key={p.id} className="flex items-center justify-between gap-2 text-xs border border-zinc-200 dark:border-zinc-800 rounded-md px-2 py-1.5">
                                    <span className="truncate">
                                        <span className="font-medium">{p.name}</span>
                                        <span className="text-muted-foreground"> · {p.model}</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            removeCustomProvider(p.id);
                                            if (selectedProviderId === p.id) {
                                                const remaining = allProviders.filter((x) => x.id !== p.id);
                                                setSelectedProviderId(remaining[0]?.id || '');
                                            }
                                        }}
                                        className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                                        title="Удалить"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Форма добавления */}
                    {!showAddForm ? (
                        <button
                            type="button"
                            onClick={() => setShowAddForm(true)}
                            className="mt-3 w-full flex items-center justify-center gap-1 py-2 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md text-xs text-muted-foreground hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            {t('add_custom_provider', 'Добавить свой провайдер')}
                        </button>
                    ) : (
                        <div className="mt-3 border border-zinc-200 dark:border-zinc-800 rounded-md p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">Custom провайдер</span>
                                <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-muted-foreground hover:text-foreground">Отмена</button>
                            </div>
                            <div>
                                <label className="text-xs font-medium">Название</label>
                                <input type="text" className="w-full px-2 py-1.5 mt-1 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm bg-transparent" placeholder="My Mistral" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-medium">Модель</label>
                                <input type="text" className="w-full px-2 py-1.5 mt-1 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm bg-transparent" placeholder="mistral-large-latest" value={newModel} onChange={(e) => setNewModel(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-medium">Base URL</label>
                                <input type="text" className="w-full px-2 py-1.5 mt-1 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm bg-transparent" placeholder="https://api.mistral.ai" value={newBaseUrl} onChange={(e) => setNewBaseUrl(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-medium">API Key <span className="text-muted-foreground">(опц.)</span></label>
                                <input type="password" className="w-full px-2 py-1.5 mt-1 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm bg-transparent" placeholder="sk-..." value={newApiKey} onChange={(e) => setNewApiKey(e.target.value)} />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddCustomProvider}
                                disabled={!newName.trim() || !newModel.trim() || !newBaseUrl.trim()}
                                className="w-full py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Добавить
                            </button>
                        </div>
                    )}
                </section>

                <section className="border-t pt-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setStep(0);
                            setContext(null as any);
                            setHypotheses(null as any);
                            setSelectedHypothesisId(null as any);
                            setArtifacts(null as any);
                            setReport(null as any);
                            onClose?.();
                        }}
                        title="Сбросить все шаги и начать заново"
                    >
                        {t('restart_investigation', 'Начать расследование заново')}
                    </Button>
                </section>
            </div>

            {/* Нижняя панель — только на десктопе */}
            <div className="border-t border-border p-2 flex-shrink-0 hidden sm:flex flex-wrap items-center justify-center gap-1 bg-background">
                <button className={`position-btn ${sidebarPosition === 'left' ? 'active' : ''}`} onClick={() => handlePositionChange('left')} title="Прикрепить слева"><ArrowLeft className="h-4 w-4" /></button>
                <button className={`position-btn ${sidebarPosition === 'right' ? 'active' : ''}`} onClick={() => handlePositionChange('right')} title="Прикрепить справа"><ArrowRight className="h-4 w-4" /></button>
                <button className={`position-btn ${sidebarPosition === 'top' ? 'active' : ''}`} onClick={() => handlePositionChange('top')} title="Прикрепить сверху"><ArrowUp className="h-4 w-4" /></button>
                <button className={`position-btn ${sidebarPosition === 'bottom' ? 'active' : ''}`} onClick={() => handlePositionChange('bottom')} title="Прикрепить снизу"><ArrowDown className="h-4 w-4" /></button>
                <span className="text-xs text-muted-foreground ml-1">{sidebarPosition}</span>
            </div>
        </div>
    );
};