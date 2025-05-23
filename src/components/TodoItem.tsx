import type { Todo } from "../types";

export function TodoItem({ todo, onToggle }: { todo: Todo; onToggle: () => void }) {
  return (
    <li onClick={onToggle} className={todo.completed ? 'completed' : ''}>
      <input type="checkbox" checked={todo.completed} readOnly />
      <span>{todo.title}</span>
    </li>
  );
}