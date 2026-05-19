import { useShallow } from "zustand/react/shallow";
import { useTodoStore, selectFilteredTodos } from "../stores/todoStore";
import TodoItem from "./TodoItem";

function TodoList() {
  const todos = useTodoStore(useShallow(selectFilteredTodos));

  if (todos.length === 0) {
    return <p className="text-center text-zinc-600 text-sm py-6">No tasks here</p>;
  }

  // Show completed at top (dimmed, like in the mockup), then active below.
  const completed = todos.filter((t) => t.completed);
  const active = todos.filter((t) => !t.completed);

  return (
    <ul className="mt-1">
      {completed.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {active.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
