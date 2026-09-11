# TraceAI Frontend

> **AI-native рабочее пространство для SOC-аналитика.**
> Ускоряет расследование инцидентов: собирает контекст, строит деревья гипотез, обогащает артефакты и генерирует отчёты.

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 О проекте

**TraceAI** — это фронтенд-часть платформы для SOC-аналитиков, включающая:

- **Лендинг** (`/`) — публичная рекламная страница с описанием продукта.
- **Рабочее пространство** (`/app`) — основное приложение для расследований.
- **AI-ассистент** — плавающее окно чата с интеграцией LLM (Ollama, OpenAI).
- **Граф связей** — визуализация инцидентов с сотнями узлов.
- **Дерево гипотез** — структурированное представление версий атаки.

---

## 🚀 Быстрый старт

### Требования

- **Node.js** ≥ 20.11 (рекомендуется 20 LTS или 22)
- **npm** ≥ 10 (или `yarn`/`pnpm`)

Проверить версии:

```bash
node -v
npm -v
Установка
bash
# 1. Клонировать репозиторий
git clone https://github.com/Anfihal/traceai-frontend.git
cd traceai-frontend

# 2. Установить зависимости
npm install

# 3. Скопировать переменные окружения
cp .env.example .env

# 4. Запустить dev-сервер
npm run dev
Откройте http://localhost:5173.

📜 Скрипты
Команда	Описание
npm run dev	Запуск dev-сервера с HMR
npm run dev:fast	Быстрый запуск без автооткрытия браузера
npm run build	Production-сборка (с проверкой типов)
npm run build:fast	Быстрая сборка без tsc
npm run preview	Просмотр production-сборки локально
npm run lint	Проверка кода ESLint
npm run type-check	Проверка типов TypeScript
npm run clean	Очистка кэша Vite и папки dist
🏗️ Стек технологий
Ядро
React 19 — UI-фреймворк

TypeScript 5 — типизация

Vite 8 — сборщик (Rolldown)

React Router v6 — маршрутизация

Стилизация
Tailwind CSS 3.4 — утилитарные стили

tailwindcss-animate — анимации

next-themes — тёмная/светлая тема

Состояние и данные
Zustand — управление состоянием

Axios — HTTP-клиент

i18next + react-i18next — локализация (RU/EN)

UI
Radix UI — доступные компоненты

Lucide React — иконки

Framer Motion — анимации

Sonner — toast-уведомления

Визуализация
react-force-graph-2d — графы связей

@xyflow/react (React Flow) — деревья гипотез

Recharts — графики и метрики

Чат и Markdown
react-markdown — рендеринг ответов LLM

react-syntax-highlighter — подсветка кода

react-dnd — drag & drop для окна чата

📁 Структура проекта
text
traceai-frontend/
├── public/                    # Статика (favicon, изображения)
├── src/
│   ├── api/                   # API-запросы (axios-клиенты)
│   ├── assets/                # Изображения, шрифты
│   ├── components/
│   │   ├── chat/              # AI-ассистент (ChatAssistant, ChatPortal)
│   │   ├── data/              # Вкладка данных
│   │   ├── findings/          # Журнал находок
│   │   ├── graph/             # Граф связей (GraphTab)
│   │   ├── investigation/     # Компоненты расследования
│   │   │   ├── AlertCard.tsx
│   │   │   ├── ArtifactsTable.tsx
│   │   │   ├── ContextView.tsx
│   │   │   ├── HypothesisTree.tsx
│   │   │   ├── ReportView.tsx
│   │   │   └── StepIndicator.tsx
│   │   ├── layout/            # Основной layout (MainLayout, Tabs)
│   │   ├── tips/              # Подсказки
│   │   └── ui/                # UI-компоненты (кнопки, диалоги)
│   ├── contexts/              # React Context (ChatContext и др.)
│   ├── hooks/                 # Кастомные хуки
│   ├── i18n/                  # Файлы локализации
│   ├── lib/                   # Утилиты
│   ├── pages/
│   │   └── Landing/           # Лендинг
│   │       ├── index.tsx
│   │       ├── Header.tsx
│   │       ├── Hero.tsx
│   │       └── index.css
│   ├── stores/                # Zustand-сторы
│   ├── types/                 # TypeScript-типы
│   ├── App.tsx                # Маршрутизация + провайдеры
│   ├── main.tsx               # Точка входа
│   └── index.css              # Глобальные стили
├── index.html
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
🗺️ Маршрутизация
Путь	Компонент	Описание
/	LandingPage	Публичный лендинг
/app	AppContent	Основное рабочее пространство
/app/*	подмаршруты	Расследование, граф, чат
/login	(в разработке)	Авторизация
*	→ /	Редирект на лендинг
🎨 Темы
Проект поддерживает тёмную и светлую темы через next-themes.

Тема хранится в localStorage

Переключение: <Sun /> / <Moon /> в хедере

CSS-переменные: --background, --foreground, --primary и т.д.

Лендинг
Использует отдельные переменные: --landing-bg, --landing-surface, --landing-text и т.д.

Акцентный цвет: #20f0e7 (бирюзовый)

🌍 Локализация (i18n)
Поддерживаются RU и EN. Все тексты вынесены в src/i18n/.

tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('hero.title')}</h1>;
Переключение языка: кнопка RU/EN в хедере лендинга.

⚙️ Переменные окружения
Создайте .env в корне проекта:

env
VITE_API_URL=http://localhost:8000
VITE_LLM_PROVIDER=ollama
VITE_LLM_MODEL=llama3
VITE_OLLAMA_URL=http://localhost:11434
⚡ Оптимизация производительности
Кэш Vite
Не удаляйте node_modules/.vite без необходимости — это ускоряет повторные запуски.

bash
# Только если что-то сломалось:
npm run clean
SWC вместо Babel (опционально, +10x скорость)
bash
npm install -D @vitejs/plugin-react-swc
npm uninstall @vitejs/plugin-react
В vite.config.ts:

ts
import react from '@vitejs/plugin-react-swc';
Windows Defender
Добавьте папку проекта в исключения антивируса — ускоряет старт на 30–50%.

Профилирование
Если старт долгий:

bash
npx vite --profile
Затем откройте chrome://tracing → Load → vite-profile.json.

🧪 Тестирование
bash
# Запуск тестов (если настроены)
npm run test

# Проверка типов
npm run type-check

# Линтинг
npm run lint
📦 Сборка и деплой
Production-сборка
bash
npm run build
Результат — в папке dist/.

Docker
bash
docker build -t traceai-frontend .
docker run -p 5173:80 traceai-frontend
Деплой на Vercel / Netlify
Подключите репозиторий.

Build command: npm run build

Output directory: dist

🐛 Известные проблемы
Проблема	Решение
Cannot find module '@/...'	Проверьте tsconfig.json → paths
Vite долго стартует	Не чистите .vite кэш, добавьте проект в исключения антивируса
Ошибки типов в manualChunks	Используйте функцию вместо объекта
__dirname warning	Замените на import.meta.dirname (Node ≥ 20.11)
📌 Roadmap
☑ Лендинг с тёмной/светлой темой
☑ AI-ассистент с плавающим окном
☑ Граф связей с зумом и панорамированием
☑ Дерево гипотез
☑ i18n (RU/EN)
□ Аутентификация и авторизация
☑Подключение реальных источников (SIEM, EDR)
□ Экспорт отчётов в PDF
□ Совместная работа (realtime)
📄 Лицензия
MIT © 2026 TraceAI

🔗 Ссылки
Репозиторий: github.com/Anfihal/traceai-frontend

Документация API: (в разработке)

Дизайн в Figma: (по запросу)

👥 Команда
Frontend Lead: @Anfihal

Design: @Anfihal

<p align="center"> Сделано с ❤️ для SOC-аналитиков </p> ```
Этот README покрывает всё:

Быстрый старт и скрипты.

Полный стек технологий.

Структуру папок.

Маршрутизацию, темы, i18n.

Оптимизацию и troubleshooting.

Roadmap и ссылки.