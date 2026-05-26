import { useShallow } from "zustand/react/shallow";
import { useTodoStore, selectFilteredTodos } from "../stores/TodoStore";
import TodoItem from "./TodoItem";

function TodoList() {
  const todos = useTodoStore(useShallow(selectFilteredTodos));

  if (todos.length === 0) {
    return <p className="text-center text-zinc-600 text-sm py-6">No tasks here</p>;
  }

  return (
    <ul className="mt-1">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
