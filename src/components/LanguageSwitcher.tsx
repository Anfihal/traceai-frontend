import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
    { code: 'ru', label: 'Русский', short: 'RU' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'de', label: 'Deutsch', short: 'DE' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'zh', label: '中文', short: 'ZH' },
] as const;

type Props = {
    variant?: 'dark' | 'light';
};

export default function LanguageSwitcher({ variant = 'dark' }: Props) {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const currentCode = (i18n.language || 'ru').split('-')[0];
    const current = LANGUAGES.find((l) => l.code === currentCode) ?? LANGUAGES[0];

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const triggerClass =
        variant === 'dark'
            ? 'uppercase hover:text-[#20f0e7] transition-colors flex items-center gap-1'
            : 'w-8 h-8 flex items-center justify-center rounded-lg border border-[#dfe2e5] dark:border-[#292b34] bg-transparent text-[#676b75] dark:text-[#a3a6af] hover:text-[#171922] dark:hover:text-[#f7f8fa] transition text-xs font-bold uppercase';

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Change language"
                aria-haspopup="listbox"
                aria-expanded={open}
                className={triggerClass}
            >
                {current.short}
                {variant === 'dark' && (
                    <ChevronDown
                        size={12}
                        className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            {open && (
                <div
                    role="listbox"
                    className="absolute top-full right-0 mt-2 min-w-[160px] bg-white dark:bg-[#15161d] border border-[#dfe2e5] dark:border-[#292b34] rounded-lg shadow-lg py-1 z-[60]"
                >
                    {LANGUAGES.map((lang) => {
                        const isActive = lang.code === currentCode;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onClick={() => {
                                    i18n.changeLanguage(lang.code);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm text-left transition-colors ${isActive
                                    ? 'text-[#0bd6cf]'
                                    : 'text-[#171922] dark:text-[#f7f8fa] hover:bg-[#f0f1f2] dark:hover:bg-[#1b1c24]'
                                    }`}
                            >
                                <span>{lang.label}</span>
                                {isActive && <Check size={14} />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}