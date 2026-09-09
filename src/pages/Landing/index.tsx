import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight, ChevronDown, Menu, Moon, Play, Sparkles, Sun, X,
} from 'lucide-react';
import './index.css';

type Language = 'RU' | 'EN';

const copy = {
    RU: {
        nav: ['О сервисе', 'Инструкция', 'О нас', 'Тарифы'],
        support: 'Поддержка',
        login: 'Войти',
        eyebrow: 'НОВОЕ ПОКОЛЕНИЕ SOC-АССИСТЕНТОВ',
        title: 'Ваш личный AI эксперт',
        titleAccent: 'по кибербезопасности',
        lead: 'Сократите время расследования с часов до секунд. TraceAI собирает контекст, помогает проверять гипотезы и превращает расследование в последовательный процесс.',
        primary: 'Начать работу',
        secondary: 'Смотреть демо',
        alert: 'ALERT DETECTED: CVE-2024-3094',
        ago: '12ms ago',
        context: 'Обнаружена подозрительная активность в процессе sshd.',
        ai: 'AEGIS AI запускает построение дерева гипотез для выявления источника.',
        priceTitle: 'AI эксперт по кибербезопасности',
        priceSub: 'это выбор тех, кто стремится к совершенству.',
        priceAmount: '24 490₽',
        pricePeriod: '/ Мес',
    },
    EN: {
        nav: ['About', 'How it works', 'About us', 'Pricing'],
        support: 'Support',
        login: 'Log in',
        eyebrow: 'NEXT-GENERATION SOC ASSISTANT',
        title: 'Your personal AI expert',
        titleAccent: 'in cybersecurity',
        lead: 'Cut investigation time from hours to seconds. TraceAI collects context, helps validate hypotheses and turns investigation into a structured workflow.',
        primary: 'Get started',
        secondary: 'Watch demo',
        alert: 'ALERT DETECTED: CVE-2024-3094',
        ago: '12ms ago',
        context: 'Suspicious activity detected in the sshd process.',
        ai: 'AEGIS AI is building a hypothesis tree to identify the source.',
        priceTitle: 'AI cybersecurity expert',
        priceSub: 'the choice of those who strive for excellence.',
        priceAmount: '24 490₽',
        pricePeriod: '/ mo',
    },
} as const;

const navIds = ['features', 'how', 'about', 'pricing'] as const;

const features = [
    ['AI-нативный анализ', 'AI помогает строить гипотезы, связывать события и ускорять расследование.', 'cyan'],
    ['Интеллектуальный анализ атак', 'Собирает контекст из источников и показывает главное без информационного шума.', 'dark'],
    ['Генерация сценариев', 'Помогает быстро сформировать следующий шаг расследования и проверить гипотезу.', 'light'],
    ['Интеграция в рабочее пространство', 'Все артефакты, события и выводы находятся в одном месте.', 'dark'],
    ['Zero-Trust обучение моделей', 'Изолированная работа с данными и контролируемый контур AI.', 'dark'],
    ['Ассистент расследований 24/7', 'AI остаётся рядом с аналитиком на каждом этапе расследования.', 'cyan'],
];

const steps = [
    ['01', 'Моментальная первичная оценка', 'TraceAI автоматически собирает контекст события и выделяет ключевые признаки.'],
    ['02', 'Генерация и проверка гипотез', 'AI помогает формировать версии атаки и быстро проверять их по доступным данным.'],
    ['03', 'AI-интерактивный отчёт', 'Результат расследования превращается в понятный отчёт без ручной рутины.'],
    ['04', 'Локализация в один клик', 'Следующий шаг доступен непосредственно из рабочего пространства аналитика.'],
];

export default function LandingPage() {
    const { resolvedTheme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);
    const [openStep, setOpenStep] = useState(0);
    const [language, setLanguage] = useState<Language>('RU');
    const [activeNav, setActiveNav] = useState<string>('features');

    const isDark = resolvedTheme === 'dark';
    const t = copy[language];

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenu(false);
    };

    const goToApp = () => navigate('/app');

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d0e13] text-[#171922] dark:text-[#f7f8fa] transition-colors duration-300">
            <header className="sticky top-0 z-50 border-b border-[#dfe2e5] dark:border-[#292b34] bg-white/80 dark:bg-[#0d0e13]/80 backdrop-blur-xl transition-colors">
                <div className="flex items-center justify-between h-16 px-4 max-w-6xl mx-auto lg:h-[72px]">
                    {/* Логотип */}
                    <button onClick={() => scrollTo('top')} className="flex items-center gap-3 border-0 bg-transparent p-0 text-[#171922] dark:text-[#f7f8fa] cursor-pointer flex-shrink-0">
                        <span className="w-9 h-9 rounded-md bg-[url('/favicon.svg')] bg-contain bg-center bg-no-repeat" />
                        <span className="text-xl tracking-tight lg:text-2xl">Trace AI</span>
                    </button>

                    {/* Десктопные блоки (центрируются, не растягиваются) */}
                    <div className="hidden lg:flex items-center justify-center flex-1 gap-3">
                        {/* Блок 1 – меню */}
                        <div className="flex items-center bg-black rounded-[26px] px-3 h-9 text-white text-base font-normal">
                            <nav className="flex items-center gap-3">
                                {t.nav.map((label, i) => {
                                    const isActive = activeNav === navIds[i];
                                    return (
                                        <button
                                            key={label}
                                            onClick={() => {
                                                setActiveNav(navIds[i]);
                                                scrollTo(navIds[i]);
                                            }}
                                            className={`transition-colors ${isActive ? 'text-[#20f0e7]' : 'hover:text-[#20f0e7]'}`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Блок 2 – правые элементы */}
                        <div className="flex items-center bg-black rounded-[26px] px-3 h-9 text-white text-base font-normal gap-3 flex-shrink-0">
                            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="hover:text-[#20f0e7] transition-colors" aria-label="Toggle theme">
                                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <button onClick={() => setLanguage(language === 'RU' ? 'EN' : 'RU')} className="uppercase hover:text-[#20f0e7] transition-colors">
                                {language === 'RU' ? 'ru' : 'en'}
                            </button>
                            <button onClick={() => scrollTo('contacts')} className="hover:text-[#20f0e7] transition-colors">
                                {t.support}
                            </button>
                            <button onClick={() => navigate('/login')} className="hover:text-[#20f0e7] transition-colors">
                                {t.login}
                            </button>
                        </div>
                    </div>

                    {/* Мобильные кнопки (только < lg) */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#dfe2e5] dark:border-[#292b34] bg-transparent text-[#676b75] dark:text-[#a3a6af] hover:text-[#171922] dark:hover:text-[#f7f8fa] transition">
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <button onClick={() => setLanguage(language === 'RU' ? 'EN' : 'RU')} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#dfe2e5] dark:border-[#292b34] bg-transparent text-[#676b75] dark:text-[#a3a6af] hover:text-[#171922] dark:hover:text-[#f7f8fa] transition text-xs font-bold uppercase">
                            {language === 'RU' ? 'ru' : 'en'}
                        </button>
                        <button onClick={() => setMenu(!menu)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#dfe2e5] dark:border-[#292b34] bg-[#f0f1f2] dark:bg-[#1b1c24] text-[#171922] dark:text-[#f7f8fa]">
                            {menu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* На десктопе бургер скрыт, но для сохранения структуры оставляем пустой блок */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* здесь ничего нет, только чтобы сохранить отступы */}
                    </div>
                </div>

                {/* Мобильное меню */}
                {menu && (
                    <div className="lg:hidden absolute left-0 right-0 top-16 bg-white dark:bg-[#0d0e13] border-b border-[#dfe2e5] dark:border-[#292b34] p-4 flex flex-col gap-3 shadow-lg">
                        {t.nav.map((label, i) => (
                            <button key={label} onClick={() => { setActiveNav(navIds[i]); scrollTo(navIds[i]); }} className="text-left text-lg font-medium py-2 text-[#171922] dark:text-[#f7f8fa]">
                                {label}
                            </button>
                        ))}
                        <button onClick={() => scrollTo('contacts')} className="text-left text-lg font-medium py-2 text-[#171922] dark:text-[#f7f8fa]">
                            {t.support}
                        </button>
                        <button onClick={() => navigate('/login')} className="text-left text-lg font-medium py-2 text-[#171922] dark:text-[#f7f8fa]">
                            {t.login}
                        </button>
                        <div className="flex items-center gap-4 pt-2 border-t border-[#dfe2e5] dark:border-[#292b34]">
                            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="flex items-center gap-2 text-sm text-[#676b75] dark:text-[#a3a6af]">
                                {isDark ? <Sun size={16} /> : <Moon size={16} />} Тема
                            </button>
                            <button onClick={() => setLanguage(language === 'RU' ? 'EN' : 'RU')} className="flex items-center gap-1 text-xs font-bold text-[#676b75] dark:text-[#a3a6af]">
                                <span className={language === 'RU' ? 'text-[#171922] dark:text-[#f7f8fa]' : ''}>RU</span>
                                <span>/</span>
                                <span className={language === 'EN' ? 'text-[#171922] dark:text-[#f7f8fa]' : ''}>EN</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <main>
                {/* ===== HERO ===== */}
                <section id="top" className="relative overflow-hidden min-h-[calc(100vh-72px)] flex items-center">
                    {/* Фоновое изображение */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/hero-bg.png')" }}
                    />
                    {/* Затемнение */}
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

                    <div className="relative z-10 max-w-6xl mx-auto px-4 w-full py-16 lg:py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] items-center gap-12">
                            {/* Левая колонка */}
                            <div>
                                <div className="inline-flex items-center gap-2 border border-[#66FFF2] rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#66FFF2]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FFF2] animate-pulse" />
                                    {t.eyebrow}
                                </div>
                                <h1 className="mt-5 text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.06em] text-white">
                                    {t.title}
                                    <span className="block italic font-semibold bg-gradient-to-r from-[#66FFF2] to-[#20f0e7] bg-clip-text text-transparent">
                                        {t.titleAccent}
                                    </span>
                                </h1>
                                <p className="mt-6 max-w-[400px] text-[15px] leading-relaxed text-white/70 sm:text-base">
                                    {t.lead}
                                </p>
                                <div className="mt-8">
                                    <button
                                        onClick={goToApp}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#20f0e7] px-8 py-3.5 text-sm font-bold text-[#06100f] transition hover:-translate-y-0.5 hover:shadow-[0_14px_42px_rgba(32,240,231,0.22)] group"
                                    >
                                        {t.primary} <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Правая колонка – карточки */}
                            <div className="flex flex-col gap-3">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#ff4d4d]">
                                        <span className="w-2 h-2 rounded-full bg-[#ff4d4d] animate-pulse" />
                                        {t.alert}
                                        <span className="ml-auto text-white/50 font-normal text-[9px]">{t.ago}</span>
                                    </div>
                                    <p className="mt-2 text-[13px] leading-relaxed text-white/90">
                                        {t.context}<br />
                                        <span className="text-white/60">{t.ai}</span>
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg flex items-center justify-between">
                                    <div>
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                                            {t.priceTitle}
                                        </div>
                                        <div className="text-[14px] font-medium text-white/90 mt-1">
                                            {t.priceSub}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-extrabold text-[#20f0e7]">{t.priceAmount}</div>
                                        <div className="text-[10px] text-white/50">{t.pricePeriod}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== STATS ===== */}
                <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-[#15161d] border border-[#dfe2e5] dark:border-[#292b34] rounded-xl p-6 hover:shadow-md transition">
                        <strong className="block text-3xl text-[#20f0e7]">&lt; 5 СЕК</strong>
                        <span className="block mt-2 text-[#676b75] dark:text-[#a3a6af] text-sm">Анализ и оценка инцидента</span>
                    </div>
                    <div className="bg-white dark:bg-[#15161d] border border-[#dfe2e5] dark:border-[#292b34] rounded-xl p-6 hover:shadow-md transition">
                        <strong className="block text-3xl text-[#20f0e7]">10x</strong>
                        <span className="block mt-2 text-[#676b75] dark:text-[#a3a6af] text-sm">Прирост скорости работы</span>
                    </div>
                    <div className="bg-white dark:bg-[#15161d] border border-[#dfe2e5] dark:border-[#292b34] rounded-xl p-6 hover:shadow-md transition">
                        <strong className="block text-3xl text-[#20f0e7]">94%</strong>
                        <span className="block mt-2 text-[#676b75] dark:text-[#a3a6af] text-sm">Точность гипотез и контекста</span>
                    </div>
                </section>

                {/* ===== FEATURES ===== */}
                <section id="features" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <span className="inline-block bg-[#20f0e7]/20 text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">ВОЗМОЖНОСТИ</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Интеллектуальные функции киберзащиты</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {features.map(([title, desc, tone], i) => (
                            <motion.article
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ delay: i * 0.05 }}
                                className={`p-5 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34] hover:shadow-lg transition ${tone === 'cyan' ? 'bg-[#20f0e7] border-transparent text-[#06100f]' : ''
                                    } ${tone === 'light' ? 'bg-[#f0f1f2] dark:bg-[#1b1c24]' : ''}`}
                            >
                                <div className="flex justify-between text-[9px] font-extrabold text-[#6f737c]">
                                    <span>TRACEAI</span>
                                    <span>0{i + 1}</span>
                                </div>
                                <Sparkles size={20} className="mt-2 text-[#0bd6cf]" />
                                <h3 className="text-lg font-bold mt-3">{title}</h3>
                                <p className="text-sm text-[#676b75] dark:text-[#a3a6af]">{desc}</p>
                            </motion.article>
                        ))}
                    </div>
                </section>

                {/* ===== HOW IT WORKS ===== */}
                <section id="how" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <span className="inline-block bg-[#20f0e7]/20 text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">ПРОЦЕСС</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Как TraceAI защищает вашу систему</h2>
                    </div>
                    <div className="space-y-2">
                        {steps.map(([num, title, desc], i) => (
                            <div
                                key={num}
                                className={`grid grid-cols-[55px_1fr_20px] gap-4 items-center p-4 rounded-xl border bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34] cursor-pointer transition ${openStep === i ? 'bg-[#20f0e7] border-transparent text-[#06100f]' : ''
                                    }`}
                                onClick={() => setOpenStep(i)}
                            >
                                <span className="font-extrabold text-sm">{num}</span>
                                <div>
                                    <h3 className="font-semibold text-base">{title}</h3>
                                    <AnimatePresence initial={false}>
                                        {openStep === i && (
                                            <motion.p
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="text-sm mt-1"
                                            >
                                                {desc}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <ChevronDown size={18} className={`transition ${openStep === i ? 'rotate-180' : ''}`} />
                            </div>
                        ))}
                    </div>

                    <div id="video" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 p-6 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34]">
                        <div>
                            <span className="inline-block bg-[#20f0e7]/20 text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">ВИДЕО</span>
                            <h3 className="text-2xl font-bold mt-4">Демонстрация работы системы</h3>
                            <p className="text-sm text-[#676b75] dark:text-[#a3a6af] mt-2">Посмотрите, как TraceAI сокращает путь от события до понятного вывода аналитика.</p>
                            <button onClick={goToApp} className="mt-4 inline-flex items-center gap-2 bg-[#20f0e7] text-[#06100f] px-5 py-3 rounded-full font-bold transition hover:shadow-lg">
                                <Play size={15} fill="currentColor" /> Смотреть демо
                            </button>
                        </div>
                        <div className="relative min-h-[200px] rounded-lg bg-gradient-to-br from-[#7fc8ff] via-[#1c3c59] to-[#0d141d] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_5px,rgba(255,255,255,0.05)_6px)]" />
                            <div className="z-10 w-14 h-14 rounded-full bg-[#20f0e7] flex items-center justify-center text-[#06100f] shadow-lg hover:scale-105 transition">
                                <Play fill="currentColor" size={24} />
                            </div>
                            <span className="absolute left-4 bottom-3 text-white text-[10px] z-10">TraceAI / SOC workflow</span>
                        </div>
                    </div>
                </section>

                {/* ===== TESTIMONIALS ===== */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <span className="inline-block bg-[#20f0e7]/20 text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">ЭКСПЕРТЫ</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Что говорят CISO и SOC-лиды</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-6 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34]">
                            <p className="text-base leading-relaxed">“TraceAI помогает аналитикам концентрироваться на сути инцидента, а не на ручной сборке контекста.”</p>
                            <span className="block mt-4 text-sm text-[#676b75] dark:text-[#a3a6af]">Руководитель SOC</span>
                        </div>
                        <div className="p-6 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34]">
                            <p className="text-base leading-relaxed">“Когда расследование становится последовательным, команда быстрее находит причину и фиксирует результат.”</p>
                            <span className="block mt-4 text-sm text-[#676b75] dark:text-[#a3a6af]">CISO</span>
                        </div>
                    </div>
                </section>

                {/* ===== PRICING ===== */}
                <section id="pricing" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <span className="inline-block bg-[#20f0e7]/20 text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">ТАРИФЫ</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Гибкие планы для команд любого масштаба</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-6 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34] flex flex-col min-h-[300px]">
                            <span className="text-sm font-bold">Community</span>
                            <h3 className="text-3xl font-bold mt-2">0 ₽</h3>
                            <p className="text-sm text-[#676b75] dark:text-[#a3a6af]">Для знакомства с подходом</p>
                            <ul className="mt-4 space-y-2 text-sm"><li>✓ AI-ассистент расследований</li><li>✓ Контекст и гипотезы</li><li>✓ Отчёты и история</li></ul>
                            <button onClick={goToApp} className="mt-auto self-start border border-[#dfe2e5] dark:border-[#292b34] px-5 py-2 rounded-full text-sm font-semibold hover:border-[#20f0e7] transition">Подробнее <ArrowRight size={15} className="inline" /></button>
                        </div>
                        <div className="p-6 border rounded-xl bg-[#20f0e7] border-transparent text-[#06100f] flex flex-col min-h-[300px] scale-105 shadow-lg">
                            <span className="text-sm font-bold">SOC Team</span>
                            <h3 className="text-3xl font-bold mt-2">95 000 ₽/мес</h3>
                            <p className="text-sm text-[#135b59]">Для рабочих команд SOC</p>
                            <ul className="mt-4 space-y-2 text-sm"><li>✓ Без лимита на события</li><li>✓ Построение деревьев гипотез</li><li>✓ API & Webhook интеграции</li><li>✓ Интеграция с SIEM / SOAR</li></ul>
                            <button onClick={goToApp} className="mt-auto self-start bg-[#06100f] text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg transition">Подробнее <ArrowRight size={15} className="inline" /></button>
                        </div>
                        <div className="p-6 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34] flex flex-col min-h-[300px]">
                            <span className="text-sm font-bold">Enterprise</span>
                            <h3 className="text-3xl font-bold mt-2">По запросу</h3>
                            <p className="text-sm text-[#676b75] dark:text-[#a3a6af]">Для крупных инфраструктур</p>
                            <ul className="mt-4 space-y-2 text-sm"><li>✓ Развертывание On-Premise</li><li>✓ Кастомное дообучение моделей</li><li>✓ Персональный архитектор</li><li>✓ Круглосуточный инцидент-ассистанс</li></ul>
                            <button onClick={goToApp} className="mt-auto self-start border border-[#dfe2e5] dark:border-[#292b34] px-5 py-2 rounded-full text-sm font-semibold hover:border-[#20f0e7] transition">Подробнее <ArrowRight size={15} className="inline" /></button>
                        </div>
                    </div>
                </section>

                {/* ===== CTA ===== */}
                <section id="contacts" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="p-8 border rounded-2xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34] flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <span className="inline-block bg-[#20f0e7]/20 text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">ГОТОВЫ К СТАРТУ?</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2">Готовы усилить вашу киберзащиту?</h2>
                            <p className="text-sm text-[#676b75] dark:text-[#a3a6af] max-w-lg">Покажем TraceAI на ваших сценариях и обсудим, как встроить AI в текущий SOC-процесс.</p>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <input type="email" placeholder="Ваш рабочий email" className="flex-1 px-4 py-3 rounded-full border border-[#dfe2e5] dark:border-[#292b34] bg-white dark:bg-[#0d0e13] text-[#171922] dark:text-[#f7f8fa] outline-none focus:border-[#20f0e7]" />
                            <button onClick={goToApp} className="inline-flex items-center gap-2 bg-[#20f0e7] text-[#06100f] px-6 py-3 rounded-full font-bold transition hover:shadow-lg">Запросить демо <ArrowRight size={16} /></button>
                        </form>
                    </div>
                </section>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-[#dfe2e5] dark:border-[#292b34] py-8 px-4 text-center text-sm text-[#676b75] dark:text-[#a3a6af] flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-[#171922] dark:text-[#f7f8fa] font-semibold">
                    <span className="w-6 h-6 rounded-[6px] bg-[url('/favicon.svg')] bg-contain bg-center bg-no-repeat" />
                    <span>TraceAI</span>
                </div>
                <span>AI-native workspace for SOC analysts</span>
                <span>© 2026 TraceAI</span>
            </footer>
        </div>
    );
}