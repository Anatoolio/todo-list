import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TodoFilterValue = "all" | "active" | "completed";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface TodoState {
  todos: Todo[];
  filter: TodoFilterValue;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  editTodo: (id: string, title: string) => void;
  setFilter: (filter: TodoFilterValue) => void;
  clearCompleted: () => void;
}

export const STORAGE_KEY = "todo-app/todos";

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filter: "all",

      addTodo: (title) =>
        set((s) => {
          const createdAt = Date.now();
          const id = `${createdAt}-${s.todos.length}`;
          return { todos: [...s.todos, { id, title, completed: false, createdAt }] };
        }),

      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),

      removeTodo: (id) =>
        set((s) => ({
          todos: s.todos.filter((t) => t.id !== id),
        })),

      editTodo: (id, title) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, title } : t)),
        })),

      setFilter: (filter) => set({ filter }),

      clearCompleted: () =>
        set((s) => ({
          todos: s.todos.filter((t) => !t.completed),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ todos: s.todos }),
    }
  )
);

export const selectFilteredTodos = (s: TodoState) => {
  const sorted = [...s.todos].sort((a, b) => Number(a.completed) - Number(b.completed));
  switch (s.filter) {
    case "active":
      return sorted.filter((t) => !t.completed);
    case "completed":
      return sorted.filter((t) => t.completed);
    default:
      return sorted;
  }
};

export const selectRemaining = (s: TodoState) => s.todos.filter((t) => !t.completed).length;
export const selectHasCompleted = (s: TodoState) => s.todos.some((t) => t.completed);
