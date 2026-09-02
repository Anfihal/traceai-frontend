import { useState } from 'react';
import { useFindings } from '@/hooks/useFindings';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const FINDING_TYPES = ['IP', 'Хэш', 'Процесс', 'Узел', 'Пользователь', 'Гипотеза', 'C2 IP'];

export const FindingsLog = () => {
    const { findings } = useInvestigationStore();
    const { useFindingsList, useDeleteFinding } = useFindings();
    const { isLoading, error } = useFindingsList(); // убрали data и t
    const { mutate: deleteFinding } = useDeleteFinding();

    const [filterType, setFilterType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = findings.filter(f => {
        const matchesType = filterType === 'all' || f.type === filterType;
        const matchesSearch = f.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.comment.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    if (isLoading) {
        return <div className="p-4 text-zinc-500">Loading findings…</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Failed to load findings.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Search findings…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {FINDING_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                    No findings yet. They will appear here automatically or you can add them manually.
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((finding) => (
                        <motion.div
                            key={finding.id}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-xs font-mono text-zinc-500">{finding.time.slice(11, 19)}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 font-medium">
                                        {finding.type}
                                    </span>
                                    <span className="font-mono text-sm truncate">{finding.value}</span>
                                </div>
                                {finding.comment && (
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                                        {finding.comment}
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteFinding(finding.id)}
                                className="h-8 w-8 text-zinc-400 hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};