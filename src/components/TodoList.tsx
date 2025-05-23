import type { Todo } from '../types';
import { TodoItem } from './TodoItem';

export function TodoList({
  todos,
  onToggle
}: {
  todos: Todo[];
  onToggle: (id: string) => void;
}) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={() => onToggle(todo.id)} />
      ))}
    </ul>
  );
}
