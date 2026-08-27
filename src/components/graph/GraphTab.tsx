// src/components/graph/GraphTab.tsx
import { useState, useRef, useMemo } from 'react';
import { useInvestigationStore } from '@/stores/investigationStore';
import { useTranslation } from 'react-i18next';
import ForceGraph2D from 'react-force-graph-2d';
import { Button } from '@/components/ui/button';
import {
    RefreshCw,
    Clock,
    Network,
    ZoomIn,
    ZoomOut,
    Maximize,
    Download,
    BarChart3,
    Globe,
    Server,
    Monitor,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';

interface GraphNode {
    id: string;
    label: string;
    group: number;
    val: number;
    x?: number;
    y?: number;
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export const GraphTab = () => {
    const { context, alert } = useInvestigationStore();
    const { t } = useTranslation();
    const graphRef = useRef<any>(null);
    const [view, setView] = useState<'graph' | 'timeline' | 'traffic' | 'os' | 'overview'>('graph');

    const graphData = useMemo((): GraphData => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        if (!context || !context.src || !context.dst) {
            return { nodes, links };
        }

        nodes.push({
            id: 'src',
            label: context.src.ip,
            group: 1,
            val: 12,
        });

        nodes.push({
            id: 'dst',
            label: context.dst.ip,
            group: 2,
            val: 14,
        });
        links.push({ source: 'src', target: 'dst' });

        const neighborAlerts = context.neighbor_alerts || [];
        neighborAlerts.forEach((alertItem: any, index: number) => {
            const nodeId = `c2-${index}`;
            nodes.push({
                id: nodeId,
                label: alertItem.dst_ip || 'unknown',
                group: 3,
                val: 10,
            });
            links.push({ source: 'dst', target: nodeId });
        });

        return { nodes, links };
    }, [context]);

    const quickMetrics = useMemo(() => {
        if (!context || !alert) return null;
        const totalAlerts = context.neighbor_alerts?.length + 1 || 1;
        const uniqueIps = new Set([
            context.src?.ip,
            context.dst?.ip,
            ...(context.neighbor_alerts || []).map((a: any) => a.dst_ip),
        ]).size;
        return {
            totalAlerts,
            uniqueIps,
            srcIp: context.src?.ip,
            dstIp: context.dst?.ip,
            user: alert.user,
            firstEvent: context.ts,
        };
    }, [context, alert]);

    const handleFit = () => {
        if (graphRef.current) {
            graphRef.current.zoomToFit(300);
        }
    };

    const handleZoomIn = () => {
        if (graphRef.current) {
            const currentZoom = graphRef.current.zoom();
            graphRef.current.zoom(currentZoom * 1.2);
        }
    };

    const handleZoomOut = () => {
        if (graphRef.current) {
            const currentZoom = graphRef.current.zoom();
            graphRef.current.zoom(currentZoom * 0.8);
        }
    };

    const handleExport = () => {
        if (!graphRef.current) return;
        try {
            const canvas = graphRef.current.renderer().getCanvas();
            const link = document.createElement('a');
            link.download = `graph_${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('Граф экспортирован');
        } catch {
            toast.error('Ошибка экспорта');
        }
    };

    // Функция обновления данных (заглушка)
    const handleRefresh = () => {
        toast.info('Данные обновлены (mock)');
    };

    if (!context || !context.src || !context.dst) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 dark:text-zinc-400">
                <p className="text-sm">{t('graph_info', 'Сначала соберите контекст, чтобы построить граф связей.')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Быстрые метрики */}
            {quickMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Всего алертов</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{quickMetrics.totalAlerts}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Уникальных IP</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{quickMetrics.uniqueIps}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Источник</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-mono truncate">{quickMetrics.srcIp}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Цель</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-mono truncate">{quickMetrics.dstIp}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Расширенный набор вкладок */}
            <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <div className="flex justify-center px-4 overflow-x-auto">
                    <TabsList className="inline-flex w-auto max-w-full grid-cols-5 gap-1">
                        <TabsTrigger value="graph" className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                            <Network className="w-4 h-4" /> Граф
                        </TabsTrigger>
                        <TabsTrigger value="timeline" className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                            <Clock className="w-4 h-4" /> Таймлайн
                        </TabsTrigger>
                        <TabsTrigger value="traffic" className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                            <BarChart3 className="w-4 h-4" /> Трафик
                        </TabsTrigger>
                        <TabsTrigger value="os" className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                            <Monitor className="w-4 h-4" /> ОС / Баннеры
                        </TabsTrigger>
                        <TabsTrigger value="overview" className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                            <Globe className="w-4 h-4" /> Обзор
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Вкладка Граф */}
                <TabsContent value="graph" className="mt-4">
                    <div className="relative w-full h-[600px] bg-zinc-50 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={graphData}
                            nodeLabel="label"
                            nodeColor={(node: any) => {
                                if (node.group === 1) return '#3b82f6';
                                if (node.group === 2) return '#ef4444';
                                return '#f59e0b';
                            }}
                            nodeVal={(node: any) => node.val || 10}
                            linkColor={() => 'rgba(100, 100, 100, 0.3)'}
                            linkWidth={2}
                            linkDirectionalParticles={2}
                            linkDirectionalParticleWidth={1.5}
                            backgroundColor="transparent"
                            cooldownTicks={100}
                            onEngineStop={() => {
                                setTimeout(() => {
                                    if (graphRef.current) {
                                        graphRef.current.zoomToFit(300);
                                    }
                                }, 100);
                            }}
                            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                                const label = node.label || node.id;
                                const fontSize = 10 / globalScale;
                                ctx.font = `${fontSize}px "Geist", "Inter", system-ui, sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = '#18181b';
                                ctx.fillText(label, node.x, node.y + 16);
                            }}
                        />
                        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg">
                            <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Увеличить" className="h-10 w-10">
                                <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Уменьшить" className="h-10 w-10">
                                <ZoomOut className="w-4 h-4" />
                            </Button>
                            <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700" />
                            <Button variant="ghost" size="icon" onClick={handleFit} title="Центрировать" className="h-10 w-10">
                                <Maximize className="w-4 h-4" />
                            </Button>
                            <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700" />
                            <Button variant="ghost" size="icon" onClick={handleExport} title="Экспортировать в PNG" className="h-10 w-10">
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="absolute top-4 left-4 text-xs text-zinc-500 dark:text-zinc-400 pointer-events-none">
                            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Источник
                            <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-3 mr-1"></span> Цель (C2)
                            <span className="inline-block w-3 h-3 rounded-full bg-amber-500 ml-3 mr-1"></span> C2 соседние
                        </div>
                    </div>
                </TabsContent>

                {/* Вкладка Таймлайн */}
                <TabsContent value="timeline" className="mt-4">
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 min-h-[400px]">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium">Хронология событий</h4>
                            <Button variant="outline" size="sm" onClick={handleRefresh}>
                                <RefreshCw className="w-3 h-3 mr-1" /> Обновить
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {context.neighbor_alerts?.length === 0 && (
                                <p className="text-sm text-zinc-500">Нет дополнительных событий для отображения.</p>
                            )}
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">{alert?.rule || 'Исходный алерт'}</p>
                                    <p className="text-xs text-zinc-500">{context.ts}</p>
                                    <p className="text-xs text-zinc-500 font-mono">src: {context.src.ip} → dst: {context.dst.ip}</p>
                                </div>
                            </div>
                            {context.neighbor_alerts?.map((alertItem: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium">Соседний алерт #{idx + 1}</p>
                                        <p className="text-xs text-zinc-500">{alertItem.time}</p>
                                        <p className="text-xs text-zinc-500 font-mono">dst: {alertItem.dst_ip}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Вкладка Трафик */}
                <TabsContent value="traffic" className="mt-4">
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium">Статистика трафика</h4>
                            <Button variant="outline" size="sm" onClick={handleRefresh}>
                                <RefreshCw className="w-3 h-3 mr-1" /> Обновить
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Прикладные протоколы</h5>
                                <ul className="space-y-1 text-sm">
                                    <li className="flex justify-between"><span>smb-mailslot</span><span className="font-mono">1.21 КБ</span></li>
                                    <li className="flex justify-between"><span>smb</span><span className="font-mono">6.09 КБ</span></li>
                                    <li className="flex justify-between"><span>dcerpc</span><span className="font-mono">132.94 КБ</span></li>
                                    <li className="flex justify-between"><span>quic</span><span className="font-mono">223.44 КБ</span></li>
                                    <li className="flex justify-between"><span>tls</span><span className="font-mono">596.56 КБ</span></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Транспортные протоколы</h5>
                                <ul className="space-y-1 text-sm">
                                    <li className="flex justify-between"><span>icmpv6</span><span className="font-mono">720 Б</span></li>
                                    <li className="flex justify-between"><span>tcp</span><span className="font-mono">1.09 МБ</span></li>
                                    <li className="flex justify-between"><span>udp</span><span className="font-mono">1.36 МБ</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Интенсивность трафика (объём)</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between p-2 bg-zinc-100 dark:bg-zinc-800 rounded"><span>Отправка</span><span className="font-mono">2.4 МБ</span></div>
                                <div className="flex justify-between p-2 bg-zinc-100 dark:bg-zinc-800 rounded"><span>Получение</span><span className="font-mono">1.8 МБ</span></div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Пары «клиент — сервер» по сессиям</h5>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-zinc-200 dark:border-zinc-700">
                                            <th className="text-left py-1 px-2">Клиент</th>
                                            <th className="text-left py-1 px-2">Сервер</th>
                                            <th className="text-left py-1 px-2">Сессии</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="py-1 px-2 font-mono">server-victim-01</td><td className="py-1 px-2 font-mono">rmsfstatistics</td><td className="py-1 px-2">4</td></tr>
                                        <tr><td className="py-1 px-2 font-mono">server-victim-02</td><td className="py-1 px-2 font-mono">onedscolpr</td><td className="py-1 px-2">3</td></tr>
                                        <tr><td className="py-1 px-2 font-mono">server-victim-03</td><td className="py-1 px-2 font-mono">c.msn.com</td><td className="py-1 px-2">3</td></tr>
                                        <tr><td className="py-1 px-2 font-mono">server-victim-04</td><td className="py-1 px-2 font-mono">ntp-msn-c</td><td className="py-1 px-2">3</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Вкладка ОС / Баннеры */}
                <TabsContent value="os" className="mt-4">
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium">ОС клиентов и баннеры серверов</h4>
                            <Button variant="outline" size="sm" onClick={handleRefresh}>
                                <RefreshCw className="w-3 h-3 mr-1" /> Обновить
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Операционные системы клиентов</h5>
                                <ul className="space-y-1 text-sm">
                                    <li className="flex justify-between"><span>Microsoft Windows 10</span><span className="font-mono">64</span></li>
                                    <li className="flex justify-between"><span>Microsoft Windows Server 2019</span><span className="font-mono">12</span></li>
                                    <li className="flex justify-between"><span>Linux (Ubuntu 20.04)</span><span className="font-mono">8</span></li>
                                    <li className="flex justify-between"><span>macOS 12</span><span className="font-mono">3</span></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Баннеры серверов по числу сессий</h5>
                                <ul className="space-y-1 text-sm">
                                    <li className="flex justify-between"><span>Windows Server 2022</span><span className="font-mono">1</span></li>
                                    <li className="flex justify-between"><span>Windows Server 2019</span><span className="font-mono">1</span></li>
                                    <li className="flex justify-between"><span>nginx/1.18.0</span><span className="font-mono">2</span></li>
                                    <li className="flex justify-between"><span>Apache/2.4.52</span><span className="font-mono">1</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Вкладка Обзор сети */}
                <TabsContent value="overview" className="mt-4">
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium">Обзор сети</h4>
                            <Button variant="outline" size="sm" onClick={handleRefresh}>
                                <RefreshCw className="w-3 h-3 mr-1" /> Обновить
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                                <div className="text-2xl font-bold">28</div>
                                <div className="text-xs text-zinc-500">Узлов</div>
                            </div>
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                                <div className="text-2xl font-bold">6</div>
                                <div className="text-xs text-zinc-500">Клиентов</div>
                            </div>
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                                <div className="text-2xl font-bold">25</div>
                                <div className="text-xs text-zinc-500">Серверов</div>
                            </div>
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                                <div className="text-2xl font-bold">10</div>
                                <div className="text-xs text-zinc-500">Уникальных доменов</div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Локализация / Основные узлы</h5>
                            <div className="flex flex-wrap gap-1">
                                {['edge.microsoft.com', 'assets.msn.com', 'ntp-msn-com-world-atm-default.trafficmanager.net', 'img-s-msn-com.akamaized.net', '10.0.15.15', '10.0.30.2', 'dc-victim2.vulnerable.local', 'dc-victim.vulnerable.local', 'r.msftstatic.com', '51.132.193.105'].map((item) => (
                                    <span key={item} className="inline-block px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-xs font-mono">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};