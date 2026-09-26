import { useEffect, useState } from 'react';

export interface AvailableProvider {
    id: string;
    name: string;
    type: 'ollama';
    model: string;
}

interface UseAvailableProvidersResult {
    providers: AvailableProvider[];
    loading: boolean;
    error: string | null;
    reload: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export function useAvailableProviders(): UseAvailableProvidersResult {
    const [providers, setProviders] = useState<AvailableProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(`${API_BASE}/api/llm/available`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data) => {
                if (cancelled) return;
                setProviders(data.providers || []);
            })
            .catch((e) => {
                if (cancelled) return;
                setError(String(e));
                setProviders([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [tick]);

    return {
        providers,
        loading,
        error,
        reload: () => setTick((v) => v + 1),
    };
}