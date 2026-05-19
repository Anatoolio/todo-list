import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TodoFilterValue = "all" | "active" | "completed";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  filter: TodoFilterValue;
  nextId: number;
  addTodo: (title: string) => boolean;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  editTodo: (id: number, title: string) => boolean;
  setFilter: (filter: TodoFilterValue) => void;
  clearCompleted: () => number;
}

export const STORAGE_KEY = "todo-app/todos";

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: "all",
      nextId: 1,

      addTodo: (title) => {
        const trimmed = title.trim();
        if (!trimmed) return false;
        set((s) => ({
          todos: [...s.todos, { id: s.nextId, title: trimmed, completed: false }],
          nextId: s.nextId + 1,
        }));
        return true;
      },

      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),

      removeTodo: (id) =>
        set((s) => ({
          todos: s.todos.filter((t) => t.id !== id),
        })),

      editTodo: (id, title) => {
        const trimmed = title.trim();
        if (!trimmed) return false;
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, title: trimmed } : t)),
        }));
        return true;
      },

      setFilter: (filter) => set({ filter }),

      clearCompleted: () => {
        const before = get().todos.length;
        const todos = get().todos.filter((t) => !t.completed);
        set({ todos });
        return before - todos.length;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ todos: s.todos, nextId: s.nextId }),
    }
  )
);

export const selectFilteredTodos = (s: TodoState) => {
  switch (s.filter) {
    case "active":
      return s.todos.filter((t) => !t.completed);
    case "completed":
      return s.todos.filter((t) => t.completed);
    default:
      return s.todos;
  }
};

export const selectRemaining = (s: TodoState) => s.todos.filter((t) => !t.completed).length;
export const selectHasCompleted = (s: TodoState) => s.todos.some((t) => t.completed);

// For testing
export const resetTodoStore = () => useTodoStore.setState({ todos: [], filter: "all", nextId: 1 });
