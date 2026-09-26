# TraceAI Frontend

> **AI-native рабочее пространство для SOC-аналитика.**
> Ускоряет расследование инцидентов: собирает контекст, строит деревья гипотез, обогащает артефакты и генерирует отчёты.
> Лендинг + SPA с интерактивным графом, деревом гипотез и чат-ассистентом.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://www.docker.com/)

---

## 📖 О проекте

Frontend TraceAI состоит из **двух приложений**:

1. **Лендинг** (`/`) — публичная страница с описанием продукта, тарифами и демо.
2. **Рабочее пространство** (`/app`) — SPA для расследований с 6 вкладками.

### Возможности

- **Лендинг** — hero, фичи, тарифы, CTA, тёмная/светлая тема, RU/EN.
- **Расследование** — пошаговый процесс: алерт → контекст → гипотезы → артефакты → отчёт.
- **Граф связей** — интерактивный `react-force-graph-2d` с зумом и легендой.
- **Дерево гипотез** — модалки «Источники», «В чат», «JSON» для каждой версии.
- **Чат-ассистент** — плавающее окно с drag & drop, экспортом, контекстом.
- **Журнал находок** — автоматическое и ручное добавление.
- **Данные** — статистика, таймлайн, ОС/баннеры.
- **Темы** — `next-themes` (dark/light).
- **i18n** — RU, EN, DE, ES, FR, ZH.

---

## 🚀 Быстрый старт

### Требования

- **Node.js** ≥ 20.11
- **npm** ≥ 10

### Установка

```bash
# 1. Клонировать
git clone https://github.com/Anfihal/traceai-frontend.git
cd traceai-frontend

# 2. Установить зависимости
npm install

# 3. Настроить окружение
### Создание `.env`

Создайте файл `.env` в **корне проекта** (`soc-platform/.env`) с одной строкой:

```env
VITE_API_URL=/api
```

> **Важно:** путь **относительный** (`/api`), а не `http://localhost:8000`.
> Запросы пойдут на тот же домен, nginx проксирует их на `backend:8000`.

# 4. Запустить
npm run dev
Открыть: http://localhost:5173

🐳 Запуск в Docker
Сборка
bash
docker build -t traceai-frontend:latest .
Через Docker Compose
bash
docker compose -f docker-compose.build.yml build
docker compose up -d
📁 Структура проекта
text
soc-platform/
├── public/                        # Статика (favicon.svg, hero-bg.png)
├── src/
│   ├── api/                       # Axios-клиенты
│   │   └── client.ts              # baseURL из VITE_API_URL
│   ├── components/
│   │   ├── chat/                  # AI-ассистент
│   │   │   ├── ChatAssistant.tsx
│   │   │   ├── ChatPortal.tsx
│   │   │   ├── ContextDisplay.tsx
│   │   │   ├── DockableTabContent.tsx
│   │   │   └── FloatingChatButton.tsx
│   │   ├── data/                  # Вкладка «Данные»
│   │   ├── findings/              # Журнал находок
│   │   ├── graph/                 # Граф связей (react-force-graph-2d)
│   │   ├── investigation/         # Компоненты расследования
│   │   │   ├── AlertCard.tsx
│   │   │   ├── ArtifactsTable.tsx
│   │   │   ├── ContextView.tsx
│   │   │   ├── HypothesisTree.tsx
│   │   │   ├── HypothesisSourcesModal.tsx
│   │   │   ├── HypothesisConsoleModal.tsx
│   │   │   ├── ReportView.tsx
│   │   │   └── StepIndicator.tsx
│   │   ├── layout/                # MainLayout, TabsNavigation
│   │   ├── tips/                  # TipsTab
│   │   └── ui/                    # Radix-обёртки, кнопки
│   ├── contexts/                  # React Context (ChatContext)
│   ├── hooks/                     # useSession, useChat, useContextCollection
│   ├── i18n/                      # Локализация
│   │   └── locales/
│   │       ├── ru/                # Русский
│   │       ├── en/                # Английский
│   │       ├── de/                # Немецкий
│   │       ├── es/                # Испанский
│   │       ├── fr/                # Французский
│   │       └── zh/                # Китайский
│   ├── lib/                       # Утилиты (clsx, tailwind-merge)
│   ├── pages/
│   │   └── Landing/               # Лендинг
│   │       ├── index.tsx
│   │       ├── Header.tsx
│   │       ├── Hero.tsx
│   │       └── index.css
│   ├── stores/                    # Zustand
│   ├── types/                     # TypeScript-типы
│   ├── App.tsx                    # Маршруты + провайдеры
│   ├── main.tsx                   # Точка входа
│   └── index.css                  # Глобальные стили + Tailwind
├── .dockerignore
├── .env                           # VITE_API_URL=/api
├── Dockerfile                     # Multi-stage: node → nginx
├── nginx.conf                     # SPA-роутинг + прокси на backend
├── docker-compose.build.yml       # Локальная сборка образов
├── docker-compose.deploy.yml      # Деплой на сервер
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
📜 Скрипты
Команда	Описание
npm run dev	Dev-сервер с HMR
npm run build	Production-сборка (dist/)
npm run preview	Просмотр production-сборки
npm run lint	ESLint (oxlint)
npm run type-check	Проверка типов TypeScript
🗺️ Маршрутизация
Путь	Компонент	Описание
/	LandingPage	Публичный лендинг
/app	AppContent	Рабочее пространство
/app/dashboard	Дашборд	Основной экран
/login	(в разработке)	Авторизация
*	→ /	Редирект на лендинг
🎨 Темы
Проект поддерживает тёмную и светлую темы через next-themes.

Палитра (соответствует лендингу)
Токен	Тёмная тема	Светлая тема
--background	#0d0e13	#f7f7f5
--foreground	#f7f8fa	#171922
--card	#15161d	#ffffff
--border	#292b34	#dfe2e5
--primary	#20f0e7	#20f0e7
--primary-foreground	#06100f	#06100f
--destructive	#ff4d4d	#ff4d4d
Правило: на бирюзовом #20f0e7 — только тёмный текст #06100f (WCAG AAA).

🌍 Локализация
Файлы локализации: src/i18n/locales/{lang}/common.json.

tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('landing.title')}</h1>;
Переключение языка
Кнопка RU/EN в хедере лендинга. Поддерживаются: ru, en, de, es, fr, zh.

⚙️ Переменные окружения
Переменная	Описание	Значение
VITE_API_URL	Базовый путь API	/api
Важно: используем относительный путь /api — nginx проксирует на backend:8000.

🏗️ Архитектура
text
Пользователь
    │
    ▼
Nginx (container: frontend)
    │
    ├── /          → React SPA (index.html + assets)
    ├── /api/      → proxy → backend:8000
    └── /ws/       → proxy → backend:8000 (WebSocket)
                │
                ▼
         FastAPI (container: backend)
                │
                ├── Ollama (LLM)
                ├── ChromaDB (векторная память)
                ├── Redis (кеш)
                └── PostgreSQL (сессии)
🐛 Возможные проблемы
Проблема	Причина	Решение
404 на /app/dashboard	Nginx не отдаёт index.html	Добавить try_files $uri $uri/ /index.html;
CORS error	Домен фронта не в allow_origins	Обновить app/main.py в бэкенде
POST /session/start → 405	Неверный VITE_API_URL	Установить VITE_API_URL=/api
Cannot find module '@/...'	Не настроен alias	Проверить tsconfig.json → paths
Белый экран	Ошибка сборки	npm run build локально — покажет ошибку
⚡ Оптимизация
Кэш Vite
Не удаляйте node_modules/.vite — это ускоряет повторные запуски.

bash
npm run clean   # только если что-то сломалось
SWC вместо Babel
Уже используется @vitejs/plugin-react-swc — в 10 раз быстрее Babel.

Windows Defender
Добавьте папку проекта в исключения — ускоряет старт на 30–50%.

📌 Roadmap
☑ Лендинг с тёмной/светлой темой
☑ AI-ассистент с плавающим окном
☑ Граф связей с зумом
☑ Дерево гипотез с модалками
☑ i18n (RU, EN, DE, ES, FR, ZH)
□ Аутентификация (JWT)
□ Автоматический режим расследования
□ Экспорт отчётов в PDF
□ Realtime-обновления (WebSocket)
📄 Лицензия
MIT © 2026 TraceAI

🔗 Ссылки
Backend: github.com/Anfihal/traceai-backend

Продакшен: traceai.infiniteleaderstech.ru

Figma: по запросу

<p align="center"> Сделано с ❤️ для SOC-аналитиков </p> ```
Этот README покрывает всё:

Быстрый старт и скрипты.

Полный стек технологий.

Структуру папок.

Маршрутизацию, темы, i18n.

Оптимизацию и troubleshooting.

Roadmap и ссылки.