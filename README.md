
```markdown
# TraceAI Frontend

> **AI-native рабочее пространство для SOC-аналитика.**
> Ускоряет расследование инцидентов: собирает контекст, строит деревья гипотез, обогащает артефакты и генерирует отчёты.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://www.docker.com/)

**Разработчик:** Infinite Leaders Tech
**Продукт:** TraceAI
**Версия:** 1.0
**Дата:** 2026

---

## 📖 О проекте

Frontend TraceAI состоит из **двух приложений**:

1. **Лендинг** (`/`) — публичная страница с описанием продукта, тарифами и демо.
2. **Рабочее пространство** (`/app`) — SPA для расследований с 6 вкладками.

### Возможности

- **Лендинг** — hero, фичи, тарифы, CTA, тёмная/светлая тема, RU/EN.
- **Расследование** — пошаговый процесс: алерт → контекст → гипотезы → артефакты → отчёт.
- **Граф связей** — интерактивный `react-force-graph-2d` с зумом и легендой.
- **Дерево гипотез** — модалки «Источники», «В чат», «JSON».
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
git clone https://github.com/Anfihal/traceai-frontend.git
cd traceai-frontend
npm install
npm run dev
```

Открыть: <http://localhost:5173>

### Переменные окружения

Создайте `.env` в корне проекта:

```env
VITE_API_URL=/api
```

> Относительный путь `/api` — nginx проксирует на `backend:8000`.

---

## 🐳 Запуск в Docker

```bash
docker build -t traceai-frontend:latest .
docker compose -f docker-compose.build.yml build
docker compose up -d
```

---

## 📁 Структура проекта

```text
soc-platform/
├── public/                        # Статика (favicon.svg, hero-bg.png)
├── src/
│   ├── api/                       # Axios-клиенты
│   ├── components/                # Chat, Data, Findings, Graph, Investigation
│   ├── contexts/                  # React Context (ChatContext)
│   ├── hooks/                     # useSession, useChat, useContextCollection
│   ├── i18n/                      # Локализация (ru, en, de, es, fr, zh)
│   ├── lib/                       # Утилиты (clsx, tailwind-merge)
│   ├── pages/                     # Landing
│   ├── stores/                    # Zustand
│   ├── types/                     # TypeScript-типы
│   ├── App.tsx                    # Маршруты + провайдеры
│   ├── main.tsx                   # Точка входа
│   └── index.css                  # Глобальные стили + Tailwind
├── Dockerfile                     # Multi-stage: node → nginx
├── nginx.conf                     # SPA-роутинг + прокси на backend
└── README.md
```

---

## 📜 Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с HMR |
| `npm run build` | Production-сборка (`dist/`) |
| `npm run preview` | Просмотр production-сборки |
| `npm run lint` | ESLint (oxlint) |
| `npm run type-check` | Проверка типов TypeScript |

---

## 🗺️ Маршрутизация

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/` | LandingPage | Публичный лендинг |
| `/app` | AppContent | Рабочее пространство |
| `/app/dashboard` | Дашборд | Основной экран |
| `/login` | (в разработке) | Авторизация |
| `*` | → `/` | Редирект на лендинг |

---

## 🎨 Темы

Поддержка тёмной и светлой темы через `next-themes`.

| Токен | Тёмная тема | Светлая тема |
|-------|-------------|--------------|
| `--background` | `#0d0e13` | `#f7f7f5` |
| `--foreground` | `#f7f8fa` | `#171922` |
| `--card` | `#15161d` | `#ffffff` |
| `--border` | `#292b34` | `#dfe2e5` |
| `--primary` | `#20f0e7` | `#20f0e7` |
| `--primary-foreground` | `#06100f` | `#06100f` |
| `--destructive` | `#ff4d4d` | `#ff4d4d` |

> На бирюзовом `#20f0e7` — только тёмный текст `#06100f` (WCAG AAA).

---

## 🌍 Локализация

Файлы локализации: `src/i18n/locales/{lang}/common.json`.

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('landing.title')}</h1>;
```

Поддерживаются: `ru`, `en`, `de`, `es`, `fr`, `zh`.

---

## ⚙️ Переменные окружения

| Переменная | Описание | Значение |
|------------|----------|----------|
| `VITE_API_URL` | Базовый путь API | `/api` |

---

## 🏗️ Архитектура

```text
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
```

---

## 🐛 Возможные проблемы

| Проблема | Причина | Решение |
|----------|---------|---------|
| 404 на `/app/dashboard` | Nginx не отдаёт `index.html` | Добавить `try_files $uri $uri/ /index.html;` |
| CORS error | Домен фронта не в `allow_origins` | Обновить `app/main.py` в бэкенде |
| `POST /session/start` → 405 | Неверный `VITE_API_URL` | Установить `VITE_API_URL=/api` |
| `Cannot find module '@/...'` | Не настроен alias | Проверить `tsconfig.json` → `paths` |
| Белый экран | Ошибка сборки | `npm run build` локально — покажет ошибку |

---

## 💼 Коммерческое использование и лицензирование

Продукт **TraceAI** разработан компанией **Infinite Leaders Tech** и распространяется на условиях коммерческой лицензии.

### Варианты лицензий

| Тариф | Условия | Стоимость |
|-------|---------|-----------|
| **Community** | Для знакомства с продуктом, без коммерческого использования | Бесплатно |
| **SOC Team** | Для рабочих команд SOC, без ограничений на события | 95 000 ₽ / мес |
| **Enterprise** | On-Premise, кастомное дообучение моделей, персональный архитектор, 24/7 | По запросу |

### Что входит в лицензию

- Исходный код Frontend + Backend
- Право на развёртывание в инфраструктуре Лицензиата
- Техническая документация
- Обновления в течение срока действия договора
- Техническая поддержка (по SLA)

### Ограничения

- Запрещена перепродажа продукта третьим лицам без письменного согласия
- Запрещено снятие или изменение знаков авторского права
- Использование допускается только в объёме, указанном в договоре

---

## 📄 Порядок заключения договора

1. **Заявка.** Направьте запрос на почту или в Telegram с указанием:
   - Название организации
   - ИНН / КПП
   - Контактное лицо
   - Интересующий тариф
   - Сценарии использования

2. **Коммерческое предложение.** Мы подготовим КП с расчётом стоимости под ваши задачи.

3. **Согласование условий.** Обсуждаем объём лицензии, SLA, порядок поддержки.

4. **Подписание договора.** Возможны варианты:
   - Электронно через **Контур.Диадок** или **СБИС**
   - Бумажный документооборот
   - По ЭДО партнёра

5. **Активация.** Передаём лицензионные ключи, доступ к обновлениям, помогаем с развёртыванием.

---

## 📞 Контакты

**Infinite Leaders Tech**

| Канал | Контакт |
|-------|---------|
| **Email** | [InfiniteleadersTech@yandex.ru](mailto:InfiniteleadersTech@yandex.ru) |
| **Telegram** | [@InfiniteleadersTech](https://t.me/InfiniteleadersTech) |
| **Сайт продукта** | [traceai.infiniteleaderstech.ru](https://traceai.infiniteleaderstech.ru) |

По вопросам заключения договора обращайтесь по почте — ответим в течение рабочего дня.

---

## 📌 Roadmap

- [x] Лендинг с тёмной/светлой темой
- [x] AI-ассистент с плавающим окном
- [x] Граф связей с зумом
- [x] Дерево гипотез с модалками
- [x] i18n (RU, EN, DE, ES, FR, ZH)
- [ ] Аутентификация (JWT)
- [ ] Автоматический режим расследования
- [ ] Экспорт отчётов в PDF
- [ ] Realtime-обновления (WebSocket)

---

## 📄 Лицензия

Proprietary © 2026 Infinite Leaders Tech. Все права защищены.

Использование продукта регулируется условиями договора между Лицензиаром и Лицензиатом.

---

## 🔗 Ссылки

- **Backend:** [github.com/Anfihal/traceai-backend](https://github.com/Anfihal/TraceAI-SOC-Prototype)
- **Продакшен:** [traceai.infiniteleaderstech.ru](https://traceai.infiniteleaderstech.ru)

---

<p align="center">Сделано с ❤️ для SOC-аналитиков</p>
```

