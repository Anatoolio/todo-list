import { useState } from 'react';
import type { Todo } from '../types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string) => {
    setTodos(prev => [...prev, { id: crypto.randomUUID(), title, completed: false }]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  return { todos, addTodo, toggleTodo, clearCompleted };
}