import { makeAutoObservable, reaction } from "mobx";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export class TodoStore {
  todos: Todo[] = [];
  filter: "all" | "active" | "completed" = "all";
  nextId = 1;

  constructor() {
    makeAutoObservable(this); // делает все поля реактивными
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

  addTodo(title: string) {
    this.todos.push({ id: this.nextId++, title, completed: false });
  }

  toggleTodo(id: number) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) todo.completed = !todo.completed;
  }

  setFilter(filter: "all" | "active" | "completed") {
    this.filter = filter;
  }

  clearCompleted() {
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
        this.todos = parsed.map((t) => ({ id: t.id, title: t.title, completed: !!t.completed }));
        const maxId = this.todos.reduce((m, t) => Math.max(m, t.id), 0);
        this.nextId = maxId + 1;
      }
    } catch {
      // ignore broken storage
    }
  }
}

export const todoStore = new TodoStore();
