import { makeAutoObservable, reaction, runInAction } from "mobx";

declare global {
    // eslint-disable-next-line no-var
    var __USE_API__: boolean | undefined;
}

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export class TodoStore {
    todos: Todo[] = [];
    filter: "all" | "active" | "completed" = "all";
    nextId = 1;
    useApi = ((): boolean => {
        if (typeof globalThis.__USE_API__ === "boolean") return globalThis.__USE_API__;
        return false;
    })();
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this); // делает все поля реактивными
        if (this.useApi) {
            void this.fetchTodos();
        } else {
            this.load();
            reaction(
                () => this.todos.map((t) => ({ id: t.id, title: t.title, completed: t.completed })),
                (todos) => {
                    try {
                        localStorage.setItem("todo-app/todos", JSON.stringify(todos));
                    } catch {
                        // ignore storage errors
                    }
                }
            );
        }
    }

    addTodo(title: string) {
        if (this.useApi) {
            return this.apiCreate(title);
        }
        this.todos.push({ id: this.nextId++, title, completed: false });
    }

    toggleTodo(id: number) {
        if (this.useApi) {
            const todo = this.todos.find((t) => t.id === id);
            const next = !todo?.completed;
            return this.apiUpdate(id, { completed: next });
        }
        const todo = this.todos.find((t) => t.id === id);
        if (todo) todo.completed = !todo.completed;
    }

    setFilter(filter: "all" | "active" | "completed") {
        this.filter = filter;
    }

    clearCompleted() {
        if (this.useApi) {
            return this.apiClearCompleted();
        }
        this.todos = this.todos.filter((t) => !t.completed);
    }

    get filteredTodos() {
        switch (this.filter) {
            case "active":
                return this.todos.filter((t) => !t.completed);
            case "completed":
                return this.todos.filter((t) => t.completed);
            default:
                return this.todos;
        }
    }

    get remaining() {
        return this.todos.filter((t) => !t.completed).length;
    }

    private load() {
        try {
            const raw = localStorage.getItem("todo-app/todos");
            if (!raw) return;
            const parsed = JSON.parse(raw) as { id: number; title: string; completed: boolean }[];
            if (Array.isArray(parsed)) {
                this.todos = parsed.map((t) => ({
                    id: t.id,
                    title: t.title,
                    completed: !!t.completed,
                }));
                const maxId = this.todos.reduce((m, t) => Math.max(m, t.id), 0);
                this.nextId = maxId + 1;
            }
        } catch {
            // ignore broken storage
        }
    }

    private async fetchTodos() {
        this.isLoading = true;
        this.error = null;
        try {
            const res = await fetch("/api/todos");
            if (!res.ok) throw new Error(`failed ${res.status}`);
            const data = (await res.json()) as { id: number; title: string; completed: boolean }[];
            runInAction(() => {
                this.todos = data.map((t) => ({
                    id: t.id,
                    title: t.title,
                    completed: !!t.completed,
                }));
                const maxId = this.todos.reduce((m, t) => Math.max(m, t.id), 0);
                this.nextId = maxId + 1;
            });
        } catch (e: unknown) {
            runInAction(() => {
                this.error = e instanceof Error ? e.message : "load failed";
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    private async apiCreate(title: string) {
        try {
            const res = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            if (!res.ok) throw new Error("create failed");
            const t = (await res.json()) as { id: number; title: string; completed: boolean };
            runInAction(() => {
                this.todos.push({ id: t.id, title: t.title, completed: !!t.completed });
                const maxId = this.todos.reduce((m, td) => Math.max(m, td.id), 0);
                this.nextId = maxId + 1;
            });
        } catch {
            // ignore for demo
        }
    }

    private async apiUpdate(id: number, patch: Partial<{ title: string; completed: boolean }>) {
        try {
            const res = await fetch(`/api/todos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            if (!res.ok) throw new Error("update failed");
            runInAction(() => {
                const todo = this.todos.find((t) => t.id === id);
                if (todo) {
                    if (patch.title !== undefined) todo.title = patch.title;
                    if (patch.completed !== undefined) todo.completed = patch.completed;
                }
            });
        } catch {
            // ignore for demo
        }
    }

    private async apiClearCompleted() {
        try {
            const res = await fetch("/api/todos/clear-completed", { method: "POST" });
            if (!res.ok) throw new Error("clear failed");
            runInAction(() => {
                this.todos = this.todos.filter((t) => !t.completed);
            });
        } catch {
            // ignore for demo
        }
    }
}

export const todoStore = new TodoStore();
