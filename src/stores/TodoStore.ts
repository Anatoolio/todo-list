import { makeAutoObservable } from "mobx";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export class TodoStore {
  todos: Todo[] = [];
  filter: 'all' | 'active' | 'completed' = 'all';
  nextId = 1;

  constructor() {
    makeAutoObservable(this); // делает все поля реактивными
  }

  addTodo(title: string) {
    this.todos.push({ id: this.nextId++, title, completed: false });
  }

  toggleTodo(id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filter = filter;
  }

  get filteredTodos() {
    switch (this.filter) {
      case 'active': return this.todos.filter(t => !t.completed);
      case 'completed': return this.todos.filter(t => t.completed);
      default: return this.todos;
    }
  }

  get remaining() {
    return this.todos.filter(t => !t.completed).length;
  }
}

export const todoStore = new TodoStore();
