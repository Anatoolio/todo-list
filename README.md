# Todo App — React + Go API

Frontend: React + TypeScript + Vite + MobX + Tailwind. Backend: Go (chi) + SQLite.

## Prerequisites

- Node.js 18+ и npm
- Go 1.22+ (`brew install go` на macOS)

## Scripts

- `npm run dev` — запускает Vite в режиме API (`VITE_USE_API=true`). Требуется запущенный сервер.
- `npm run dev:server` — запускает Go API на `http://localhost:8080`.
- `npm run dev:full` — поднимает сервер и клиент одновременно (через `concurrently`).
- `npm run test` — тесты (Jest) с покрытием.
- `npm run build` — сборка фронтенда.

## Backend (Go)

При старте создаёт БД SQLite по пути `./data/todos.db` и поднимает REST API:

- `GET /api/todos?filter=all|active|completed`
- `POST /api/todos` { title }
- `PATCH /api/todos/:id` { title?, completed? }
- `DELETE /api/todos/:id`
- `POST /api/todos/clear-completed`

Запуск:

```
npm run dev:server
```

## Frontend (Vite)

Dev-прокси маршрутизирует `/api` на `http://localhost:8080`.

Запуск клиента в API‑режиме:

```
npm run dev
```

Рекомендуемый способ — оба процесса сразу:

```
npm run dev:full
```

## Notes

- По умолчанию клиент работает через API (localStorage отключён при `VITE_USE_API=true`).
- Если нужен локальный режим без бэка — запустите Vite без флага или временно измените скрипт.
- Порты: клиент `5173`, сервер `8080`. Прокси настраивается в `vite.config.ts`.
