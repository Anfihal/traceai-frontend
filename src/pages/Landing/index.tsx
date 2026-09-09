import { useState } from 'react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, ChevronDown, Menu, Moon, Play, ShieldCheck, Sparkles, Sun, X,
} from 'lucide-react';
import './index.css';

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
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);
    const [openStep, setOpenStep] = useState(0);

    const isDark = theme === 'dark';

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenu(false);
    };

    const goToApp = () => navigate('/app');

    return (
        <div className={`site ${isDark ? 'dark' : 'light'}`}>
            {/* ===== HEADER ===== */}
            <header className="header">
                <button className="brand" onClick={() => scrollTo('top')}>
                    <span className="brand-mark">T</span><span>TraceAI</span>
                </button>
                <nav className={menu ? 'nav open' : 'nav'}>
                    <button onClick={() => scrollTo('features')}>Возможности</button>
                    <button onClick={() => scrollTo('how')}>Как работает</button>
                    <button onClick={() => scrollTo('pricing')}>Тарифы</button>
                    <button onClick={() => scrollTo('contacts')}>Контакты</button>
                </nav>
                <div className="header-actions">
                    <button className="theme-toggle" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Тема">
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button className="pill-btn" onClick={goToApp}>
                        Получить демо <ArrowRight size={14} />
                    </button>
                    <button className="menu-btn" onClick={() => setMenu(!menu)}>
                        {menu ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <section id="top" className="hero section-shell">
                <div className="hero-copy">
                    <div className="eyebrow"><span /> AI-NATIVE SOC WORKSPACE</div>
                    <h1>Ваш личный AI эксперт <em>по кибербезопасности</em></h1>
                    <p className="lead">
                        TraceAI ускоряет работу SOC-аналитика: собирает контекст, помогает проверять гипотезы и превращает расследование в последовательный процесс.
                    </p>
                    <div className="hero-actions">
                        <button className="primary-btn" onClick={goToApp}>
                            Попробовать <ArrowRight size={17} />
                        </button>
                        <button className="ghost-btn" onClick={() => scrollTo('video')}>
                            <Play size={15} fill="currentColor" /> Смотреть демо
                        </button>
                    </div>
                </div>
                <div className="hero-art" aria-hidden="true">
                    <div className="orb orb-a" /><div className="orb orb-b" /><div className="scanline" />
                    <div className="brain-grid">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <i key={i} style={{ '--i': i } as React.CSSProperties} />
                        ))}
                    </div>
                    <div className="floating-card card-price">
                        <span>AI эксперт по<br />кибербезопасности</span><strong>₽ 24 490,00</strong>
                    </div>
                    <div className="floating-card card-sec">
                        <ShieldCheck size={15} /><span>Threat context<br /><b>ready</b></span>
                    </div>
                </div>
            </section>

            {/* ===== STATS ===== */}
            <section className="stats section-shell">
                <div className="stat"><strong>&lt; 5 СЕК</strong><span>Анализ и оценка<br />инцидента</span></div>
                <div className="stat"><strong>10x</strong><span>Прирост<br />скорости работы</span></div>
                <div className="stat"><strong>94%</strong><span>Точность гипотез<br />и контекста</span></div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="section-shell section-block">
                <div className="section-title">
                    <span className="tag">ВОЗМОЖНОСТИ</span>
                    <h2>Интеллектуальные функции киберзащиты</h2>
                </div>
                <div className="feature-grid">
                    {features.map(([title, text, tone], i) => (
                        <motion.article
                            key={title}
                            className={`feature-card ${tone}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="card-top"><span>TRACEAI</span><span>0{i + 1}</span></div>
                            <Sparkles size={20} />
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how" className="section-shell section-block">
                <div className="section-title">
                    <span className="tag">ПРОЦЕСС</span>
                    <h2>Как TraceAI защищает вашу систему</h2>
                </div>
                <div className="steps">
                    {steps.map(([num, title, text], i) => (
                        <div
                            key={num}
                            className={`step ${openStep === i ? 'active' : ''}`}
                            onClick={() => setOpenStep(i)}
                        >
                            <span className="step-num">{num}</span>
                            <div>
                                <h3>{title}</h3>
                                <AnimatePresence initial={false}>
                                    {openStep === i && (
                                        <motion.p
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                        >
                                            {text}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                            <ChevronDown size={18} />
                        </div>
                    ))}
                </div>
                <div id="video" className="video-card">
                    <div className="video-copy">
                        <span className="tag">ВИДЕО</span>
                        <h3>Демонстрация работы системы</h3>
                        <p>Посмотрите, как TraceAI сокращает путь от события до понятного вывода аналитика.</p>
                        <button className="primary-btn" onClick={goToApp}>
                            <Play size={15} fill="currentColor" /> Смотреть демо
                        </button>
                    </div>
                    <div className="video-placeholder">
                        <div className="play"><Play fill="currentColor" /></div>
                        <span>TraceAI / SOC workflow</span>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="section-shell section-block testimonials">
                <div className="section-title">
                    <span className="tag">ЭКСПЕРТЫ</span>
                    <h2>Что говорят CISO и SOC-лиды</h2>
                </div>
                <div className="quote-grid">
                    <article className="quote">
                        <p>“TraceAI помогает аналитикам концентрироваться на сути инцидента, а не на ручной сборке контекста.”</p>
                        <span>Руководитель SOC</span>
                    </article>
                    <article className="quote">
                        <p>“Когда расследование становится последовательным, команда быстрее находит причину и фиксирует результат.”</p>
                        <span>CISO</span>
                    </article>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="pricing" className="section-shell section-block">
                <div className="section-title">
                    <span className="tag">ТАРИФЫ</span>
                    <h2>Гибкие планы для команд любого масштаба</h2>
                </div>
                <div className="pricing-grid">
                    <article className="price">
                        <div><span>Community</span><h3>0 ₽</h3><p>Для знакомства с подходом</p></div>
                        <ul><li>AI-ассистент расследований</li><li>Контекст и гипотезы</li><li>Отчёты и история</li></ul>
                        <button className="ghost-btn" onClick={goToApp}>Подробнее <ArrowRight size={15} /></button>
                    </article>
                    <article className="price featured">
                        <div><span>SOC Team</span><h3>95 000 ₽/мес</h3><p>Для рабочих команд SOC</p></div>
                        <ul><li>AI-ассистент расследований</li><li>Контекст и гипотезы</li><li>Отчёты и история</li></ul>
                        <button className="primary-btn" onClick={goToApp}>Подробнее <ArrowRight size={15} /></button>
                    </article>
                    <article className="price">
                        <div><span>Enterprise</span><h3>По запросу</h3><p>Для крупных инфраструктур</p></div>
                        <ul><li>AI-ассистент расследований</li><li>Контекст и гипотезы</li><li>Отчёты и история</li></ul>
                        <button className="ghost-btn" onClick={goToApp}>Подробнее <ArrowRight size={15} /></button>
                    </article>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section id="contacts" className="cta section-shell">
                <div>
                    <span className="tag">ГОТОВЫ К СТАРТУ?</span>
                    <h2>Готовы усилить вашу киберзащиту?</h2>
                    <p>Покажем TraceAI на ваших сценариях и обсудим, как встроить AI в текущий SOC-процесс.</p>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input placeholder="Ваш рабочий email" type="email" />
                    <button className="primary-btn" onClick={goToApp}>
                        Запросить демо <ArrowRight size={16} />
                    </button>
                </form>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="footer section-shell">
                <div className="brand"><span className="brand-mark">T</span><span>TraceAI</span></div>
                <span>AI-native workspace for SOC analysts</span>
                <span>© 2026 TraceAI</span>
            </footer>
        </div>
    );
}