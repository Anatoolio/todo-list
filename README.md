# Todo App

A small, mobile-styled todo list built with React 19, Zustand and Tailwind. Tasks persist to `localStorage` and survive page reloads.

## Quick start

```bash
npm install
npm run start
```

Then open the URL printed by Vite (default `http://localhost:5173`).

## Features

- Add tasks via the input field or the floating **+** button. Pressing **Enter** also submits.
- Empty / whitespace-only input shows an inline error.
- Toggle a task by clicking its circle.
- **Edit** a task: click the pencil icon (or double-click the title). **Enter** commits, **Escape** cancels, empty value deletes.
- **Delete** a single task via the trash icon.
- Filter tasks by **All / Active / Completed**.
- **Clear completed** removes all done tasks at once and shows a transient success notice.
- Counter shows how many items are still active.

## Scripts

| Command           | What it does                               |
| ----------------- | ------------------------------------------ |
| `npm run start`   | Start the Vite dev server (alias of `dev`) |
| `npm run dev`     | Same as `start`                            |
| `npm run build`   | Type-check and produce a production build  |
| `npm run preview` | Preview the production build locally       |
| `npm test`        | Run the Jest test suite                    |
| `npm run tsc`     | Type-check only                            |
| `npm run lint`    | Run ESLint                                 |
| `npm run format`  | Format the codebase with Prettier          |

## Stack

- **React 19** with hooks (no class components)
- **TypeScript** (strict)
- **Zustand 5** for state, with the `persist` middleware writing to `localStorage`
- **Tailwind CSS 3** for styling — no UI-kit dependency
- **Vite 6** for dev server and build
- **Jest + Testing Library** for tests (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`)
- **ESLint + Prettier + Husky** for code quality

## Project structure

```text
src/
├── App.tsx                       Layout: phone card, mint header, FAB
├── main.tsx                      React entry point
├── index.css                     Tailwind directives + minimal globals
├── components/
│   ├── TodoInput.tsx             Input field, exposes submit() via ref
│   ├── TodoList.tsx              Renders filtered list (completed on top)
│   ├── TodoItem.tsx              Single row: checkbox, title, edit/delete
│   ├── TodoFilter.tsx            Filter pills + clear completed + notice
│   └── App.test.tsx              UI integration tests
└── stores/
    ├── todoStore.ts              Zustand store + selectors + persist
    └── todoStore.test.ts         Store unit tests
```

## State

The single store ([src/stores/todoStore.ts](src/stores/todoStore.ts)) holds:

| Field    | Type                               | Notes                          |
| -------- | ---------------------------------- | ------------------------------ |
| `todos`  | `Todo[]`                           | `{ id, title, completed }`     |
| `filter` | `"all" \| "active" \| "completed"` | Drives the visible list        |
| `nextId` | `number`                           | Monotonic id source, persisted |

Actions: `addTodo`, `toggleTodo`, `removeTodo`, `editTodo`, `setFilter`, `clearCompleted`.

`addTodo` and `editTodo` trim input and return `false` on empty values — the UI uses this to show errors instead of doing its own validation.

Persistence is handled by `zustand/middleware`'s `persist` (key: `todo-app/todos`); only `todos` and `nextId` are written, not the transient `filter`.

## Testing

Tests live next to the code they cover:

- [src/stores/todoStore.test.ts](src/stores/todoStore.test.ts) — store actions in isolation
- [src/components/App.test.tsx](src/components/App.test.tsx) — full UI flow: add, toggle, filter, edit, delete, clear, error, success notice, localStorage hydration

Run them with `npm test`. Jest uses `jsdom` and `ts-jest`.

## Notes

- `localStorage` writes happen on every state change via `persist`. If storage throws (quota, private mode), Zustand logs and the in-memory state keeps working.
- The store is a module-level singleton hook. Tests reset it between cases with `resetTodoStore()` from [src/stores/todoStore.ts](src/stores/todoStore.ts).
- `dist/`, `coverage/`, `.env*`, and `.claude/` are git-ignored. A `.claudeignore` keeps lock files and build output out of Claude Code's context.
