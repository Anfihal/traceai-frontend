import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight, ChevronDown, Mail, Menu, Moon, Play, Send, Sparkles, Sun, X,
} from 'lucide-react';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import './index.css';

const SUPPORT_URL = 'https://t.me/InfiniteleadersTech';
const CONTACT_EMAIL = 'InfiniteleadersTech@yandex.ru';

const navIds = ['features', 'how', 'about', 'pricing'] as const;

type FeatureItem = { title: string; desc: string; tone: 'cyan' | 'dark' | 'light' };
type StepItem = { num: string; title: string; desc: string };
type AboutHighlight = { title: string; desc: string };
type PricingPlan = {
    name: string;
    price: string;
    lead: string;
    features: string[];
    highlight: boolean;
};

export default function LandingPage() {
    const { resolvedTheme, setTheme } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [menu, setMenu] = useState(false);
    const [openStep, setOpenStep] = useState(0);
    const [activeNav, setActiveNav] = useState<string>('features');

    const isDark = resolvedTheme === 'dark';

    const navLabels = t('landing.nav', { returnObjects: true }) as string[];
    const features = t('landing.features', { returnObjects: true }) as FeatureItem[];
    const steps = t('landing.steps', { returnObjects: true }) as StepItem[];
    const aboutHighlights = t('landing.aboutHighlights', { returnObjects: true }) as AboutHighlight[];
    const pricingPlans = t('landing.pricingPlans', { returnObjects: true }) as PricingPlan[];

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenu(false);
    };

    const goToApp = () => navigate('/app');
    const goToLogin = () => navigate('/app');

    const goToSupport = () => {
        window.open(SUPPORT_URL, '_blank', 'noopener,noreferrer');
        setMenu(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d0e13] text-[#171922] dark:text-[#f7f8fa] transition-colors duration-300">
            {/* ФИКС ЦВЕТА: непрозрачный хедер — убран bg-white/80 и backdrop-blur-xl */}
            <header className="sticky top-0 z-50 border-b border-[#dfe2e5] dark:border-[#292b34] bg-white dark:bg-[#0d0e13] transition-colors">
                <div className="flex items-center justify-between h-16 px-4 max-w-6xl mx-auto lg:h-[72px]">
                    <button onClick={() => scrollTo('top')} className="flex items-center gap-3 border-0 bg-transparent p-0 text-[#171922] dark:text-[#f7f8fa] cursor-pointer flex-shrink-0">
                        <span className="w-9 h-9 rounded-md bg-[url('/favicon.svg')] bg-contain bg-center bg-no-repeat" />
                        <span className="text-xl tracking-tight lg:text-2xl">Trace AI</span>
                    </button>

                    <div className="hidden lg:flex items-center justify-center flex-1 gap-3">
                        <div className="flex items-center bg-black rounded-[26px] px-3 h-9 text-white text-base font-normal">
                            <nav className="flex items-center gap-3">
                                {navLabels.map((label, i) => {
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

                        <div className="flex items-center bg-black rounded-[26px] px-3 h-9 text-white text-base font-normal gap-3 flex-shrink-0">
                            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="hover:text-[#20f0e7] transition-colors" aria-label="Toggle theme">
                                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <LanguageSwitcher variant="dark" />
                            <button onClick={goToSupport} className="hover:text-[#20f0e7] transition-colors">
                                {t('landing.support')}
                            </button>
                            <button onClick={goToLogin} className="hover:text-[#20f0e7] transition-colors">
                                {t('landing.login')}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#dfe2e5] dark:border-[#292b34] bg-transparent text-[#676b75] dark:text-[#a3a6af] hover:text-[#171922] dark:hover:text-[#f7f8fa] transition">
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <LanguageSwitcher variant="light" />
                        <button onClick={() => setMenu(!menu)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#dfe2e5] dark:border-[#292b34] bg-[#f0f1f2] dark:bg-[#1b1c24] text-[#171922] dark:text-[#f7f8fa]">
                            {menu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                    </div>
                </div>

                {menu && (
                    <div className="lg:hidden absolute left-0 right-0 top-16 bg-white dark:bg-[#0d0e13] border-b border-[#dfe2e5] dark:border-[#292b34] p-4 flex flex-col gap-3 shadow-lg">
                        {navLabels.map((label, i) => (
                            <button key={label} onClick={() => { setActiveNav(navIds[i]); scrollTo(navIds[i]); }} className="text-left text-lg font-medium py-2 text-[#171922] dark:text-[#f7f8fa]">
                                {label}
                            </button>
                        ))}
                        <button onClick={goToSupport} className="text-left text-lg font-medium py-2 text-[#171922] dark:text-[#f7f8fa]">
                            {t('landing.support')}
                        </button>
                        <button onClick={goToLogin} className="text-left text-lg font-medium py-2 text-[#171922] dark:text-[#f7f8fa]">
                            {t('landing.login')}
                        </button>
                    </div>
                )}
            </header>

            <main>
                {/* ===== HERO ===== */}
                <section id="top" className="relative overflow-hidden min-h-[calc(100vh-72px)] flex items-center">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/hero-bg.png')" }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

                    <div className="relative z-10 max-w-6xl mx-auto px-4 w-full py-16 lg:py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] items-center gap-12">
                            <div>
                                <div className="inline-flex items-center gap-2 border border-[#66FFF2] rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#66FFF2]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FFF2] animate-pulse" />
                                    {t('landing.eyebrow')}
                                </div>
                                <h1 className="mt-5 text-[clamp(1.875rem,5vw+0.75rem,6.25rem)] font-normal leading-[1] tracking-[-0.03em] text-white text-balance [hyphens:none] [word-break:keep-all]">
                                    {t('landing.title')}
                                    <span className="block italic font-semibold bg-gradient-to-r from-[#66FFF2] to-[#20f0e7] bg-clip-text text-transparent">
                                        {t('landing.titleAccent')}
                                    </span>
                                </h1>
                                <p className="mt-6 max-w-[400px] text-[15px] leading-relaxed text-white/70 sm:text-base">
                                    {t('landing.lead')}
                                </p>
                                <div className="mt-8">
                                    <button
                                        onClick={goToApp}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#20f0e7] px-8 py-3.5 text-sm font-bold text-[#06100f] transition hover:-translate-y-0.5 hover:shadow-[0_14px_42px_rgba(32,240,231,0.22)] group"
                                    >
                                        {t('landing.primary')} <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#ff4d4d]">
                                        <span className="w-2 h-2 rounded-full bg-[#ff4d4d] animate-pulse" />
                                        {t('landing.alert')}
                                        <span className="ml-auto text-white/50 font-normal text-[9px]">{t('landing.ago')}</span>
                                    </div>
                                    <p className="mt-2 text-[13px] leading-relaxed text-white/90">
                                        {t('landing.context')}<br />
                                        <span className="text-white/60">{t('landing.ai')}</span>
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg flex items-center justify-between">
                                    <div>
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                                            {t('landing.priceTitle')}
                                        </div>
                                        <div className="text-[14px] font-medium text-white/90 mt-1">
                                            {t('landing.priceSub')}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-extrabold text-[#20f0e7]">{t('landing.priceAmount')}</div>
                                        <div className="text-[10px] text-white/50">{t('landing.pricePeriod')}</div>
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
                        <span className="block mt-2 text-[#676b75] dark:text-[#a3a6af] text-sm">{t('landing.statsEvents')}</span>
                    </div>
                    <div className="bg-white dark:bg-[#15161d] border border-[#dfe2e5] dark:border-[#292b34] rounded-xl p-6 hover:shadow-md transition">
                        <strong className="block text-3xl text-[#20f0e7]">10x</strong>
                        <span className="block mt-2 text-[#676b75] dark:text-[#a3a6af] text-sm">{t('landing.statsSpeed')}</span>
                    </div>
                    <div className="bg-white dark:bg-[#15161d] border border-[#dfe2e5] dark:border-[#292b34] rounded-xl p-6 hover:shadow-md transition">
                        <strong className="block text-3xl text-[#20f0e7]">94%</strong>
                        <span className="block mt-2 text-[#676b75] dark:text-[#a3a6af] text-sm">{t('landing.statsAccuracy')}</span>
                    </div>
                </section>

                {/* ===== FEATURES ===== */}
                <section id="features" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <span className="inline-block bg-[#20f0e7]/20 text-[#068b86] dark:text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                            {t('landing.featuresTag')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">{t('landing.featuresTitle')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {features.map((f, i) => {
                            const isCyan = f.tone === 'cyan';
                            const isLight = f.tone === 'light';
                            // ФИКС ЦВЕТА: взаимоисключающие ветки — нет конфликта bg-white vs bg-cyan
                            const cardClass = isCyan
                                ? 'bg-[#20f0e7] border-transparent text-[#06100f]'
                                : isLight
                                    ? 'bg-[#eef0f3] dark:bg-[#1b1c24] border-[#d5d9e0] dark:border-[#3a3d47]'
                                    : 'bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34]';
                            return (
                                <motion.article
                                    key={f.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`p-5 border rounded-xl hover:shadow-lg transition ${cardClass}`}
                                >
                                    {/* ФИКС ЦВЕТА: на cyan — тёмные номера */}
                                    <div className={`flex justify-between text-[9px] font-extrabold ${isCyan ? 'text-[#0a3b3a]' : 'text-[#6f737c]'}`}>
                                        <span>TRACEAI</span>
                                        <span>0{i + 1}</span>
                                    </div>
                                    {/* ФИКС ЦВЕТА: на cyan иконка тёмная, не бирюзовая */}
                                    <Sparkles size={20} className={`mt-2 ${isCyan ? 'text-[#06100f]' : 'text-[#0bd6cf]'}`} />
                                    <h3 className="text-lg font-bold mt-3">{f.title}</h3>
                                    {/* ФИКС ЦВЕТА: на cyan текст тёмный, читаемый */}
                                    <p className={`text-sm ${isCyan ? 'text-[#0a3b3a]' : 'text-[#676b75] dark:text-[#a3a6af]'}`}>
                                        {f.desc}
                                    </p>
                                </motion.article>
                            );
                        })}
                    </div>
                </section>

                {/* ===== HOW IT WORKS ===== */}
                <section id="how" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <span className="inline-block bg-[#20f0e7]/20 text-[#068b86] dark:text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                            {t('landing.processTag')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">{t('landing.processTitle')}</h2>
                    </div>
                    <div className="space-y-2">
                        {steps.map((s, i) => {
                            const isOpen = openStep === i;
                            // ФИКС ЦВЕТА: бордер на открытом шаге — не вылетает из ряда
                            const stepClass = isOpen
                                ? 'bg-[#20f0e7] border-[#0bbdb7] text-[#06100f]'
                                : 'bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34]';
                            return (
                                <div
                                    key={s.num}
                                    className={`grid grid-cols-[55px_1fr_20px] gap-4 items-center p-4 rounded-xl border cursor-pointer transition ${stepClass}`}
                                    onClick={() => setOpenStep(i)}
                                >
                                    <span className="font-extrabold text-sm">{s.num}</span>
                                    <div>
                                        <h3 className="font-semibold text-base">{s.title}</h3>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.p
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    /* ФИКС ЦВЕТА: на cyan описание тёмное */
                                                    className={`text-sm mt-1 ${isOpen ? 'text-[#0a3b3a]' : 'text-[#676b75] dark:text-[#a3a6af]'}`}
                                                >
                                                    {s.desc}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <ChevronDown size={18} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                            );
                        })}
                    </div>

                    <div id="video" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 p-6 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34]">
                        <div>
                            <span className="inline-block bg-[#20f0e7]/20 text-[#068b86] dark:text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                                {t('landing.videoBadge')}
                            </span>
                            <h3 className="text-2xl font-bold mt-4">{t('landing.videoTitle')}</h3>
                            <p className="text-sm text-[#676b75] dark:text-[#a3a6af] mt-2">{t('landing.videoLead')}</p>
                            <button onClick={goToApp} className="mt-4 inline-flex items-center gap-2 bg-[#20f0e7] text-[#06100f] px-5 py-3 rounded-full font-bold transition hover:shadow-lg">
                                <Play size={15} fill="currentColor" /> {t('landing.videoCta')}
                            </button>
                        </div>
                        <div className="relative min-h-[200px] rounded-lg bg-gradient-to-br from-[#7fc8ff] via-[#1c3c59] to-[#0d141d] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_5px,rgba(255,255,255,0.05)_6px)]" />
                            <div className="z-10 w-14 h-14 rounded-full bg-[#20f0e7] flex items-center justify-center text-[#06100f] shadow-lg hover:scale-105 transition">
                                <Play fill="currentColor" size={24} />
                            </div>
                            <span className="absolute left-4 bottom-3 text-white text-[10px] z-10">{t('landing.videoCaption')}</span>
                        </div>
                    </div>
                </section>

                {/* ===== ABOUT ===== */}
                <section id="about" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <span className="inline-block bg-[#20f0e7]/20 text-[#068b86] dark:text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                            {t('landing.aboutBadge')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">{t('landing.aboutTitle')}</h2>
                        <p className="text-sm md:text-base text-[#676b75] dark:text-[#a3a6af] mt-3 max-w-3xl">
                            {t('landing.aboutLead')}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        {aboutHighlights.map((h) => (
                            <div key={h.title} className="p-6 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34]">
                                <h3 className="text-lg font-bold">{h.title}</h3>
                                <p className="text-sm text-[#676b75] dark:text-[#a3a6af] mt-2">{h.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 md:p-8 rounded-2xl bg-[#0d0e13] text-white border border-[#292b34]">
                        <span className="inline-block bg-[#20f0e7]/15 text-[#20f0e7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                            {t('landing.aboutCaseBadge')}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold mt-4">{t('landing.aboutCaseTitle')}</h3>
                        <p className="mt-3 text-sm md:text-base leading-relaxed text-white/75 max-w-3xl">
                            {t('landing.aboutCaseText')}
                        </p>
                    </div>
                </section>

                {/* ===== PRICING ===== */}
                <section id="pricing" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <span className="inline-block bg-[#20f0e7]/20 text-[#068b86] dark:text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                            {t('landing.pricingTag')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">{t('landing.pricingTitle')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {pricingPlans.map((plan) => {
                            const hl = plan.highlight;
                            return (
                                <div
                                    key={plan.name}
                                    className={
                                        hl
                                            /* ФИКС ЦВЕТА: видимый бордер вместо transparent */
                                            ? 'p-6 border rounded-xl bg-[#20f0e7] border-[#0bbdb7] text-[#06100f] flex flex-col min-h-[300px] scale-105 shadow-lg'
                                            : 'p-6 border rounded-xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34] flex flex-col min-h-[300px]'
                                    }
                                >
                                    <span className="text-sm font-bold">{plan.name}</span>
                                    <h3 className="text-3xl font-bold mt-2">{plan.price}</h3>
                                    <p className={`text-sm ${hl ? 'text-[#135b59]' : 'text-[#676b75] dark:text-[#a3a6af]'}`}>
                                        {plan.lead}
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        {plan.features.map((feat) => (
                                            <li key={feat}>✓ {feat}</li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={goToApp}
                                        className={
                                            hl
                                                ? 'mt-auto self-start bg-[#06100f] text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg transition'
                                                : 'mt-auto self-start border border-[#dfe2e5] dark:border-[#292b34] px-5 py-2 rounded-full text-sm font-semibold hover:border-[#20f0e7] transition'
                                        }
                                    >
                                        {t('landing.pricingCta')} <ArrowRight size={15} className="inline" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ===== CONTACTS ===== */}
                <section id="contacts" className="max-w-6xl mx-auto px-4 py-12">
                    <div className="p-8 border rounded-2xl bg-white dark:bg-[#15161d] border-[#dfe2e5] dark:border-[#292b34] flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <span className="inline-block bg-[#20f0e7]/20 text-[#068b86] dark:text-[#0bbdb7] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                                {t('landing.ctaTag')}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2">{t('landing.ctaTitle')}</h2>
                            <p className="text-sm text-[#676b75] dark:text-[#a3a6af] max-w-lg">{t('landing.ctaText')}</p>
                        </div>
                        <div className="flex flex-col gap-3 text-sm shrink-0">
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="inline-flex items-center gap-2 text-[#171922] dark:text-[#f7f8fa] font-semibold hover:text-[#0bd6cf] transition"
                            >
                                <Mail size={15} className="shrink-0" />
                                {CONTACT_EMAIL}
                            </a>
                            <a
                                href={SUPPORT_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-[#676b75] dark:text-[#a3a6af] hover:text-[#0bd6cf] transition"
                            >
                                <Send size={15} className="shrink-0" />
                                @InfiniteleadersTech
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-[#dfe2e5] dark:border-[#292b34] py-8 px-4 text-center text-sm text-[#676b75] dark:text-[#a3a6af] flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-[#171922] dark:text-[#f7f8fa] font-semibold">
                    <span className="w-6 h-6 rounded-[6px] bg-[url('/favicon.svg')] bg-contain bg-center bg-no-repeat" />
                    <span>TraceAI</span>
                </div>
                <span>{t('landing.footerTagline')}</span>
                <span>{t('landing.footerCopyright')}</span>
            </footer>
        </div>
    );
}