import { observer } from "mobx-react-lite";
import { useStores } from "../stores/context";

const TodoList = observer(() => {
  const { todoStore } = useStores();

  return (
    <ul className="mb-4">
      {todoStore.filteredTodos.map((todo) => (
        <li key={todo.id} className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => todoStore.toggleTodo(todo.id)}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? "active" : "completed"}`}
          />
          <span
            className={
              todo.completed
                ? "line-through text-gray-400 dark:text-slate-500"
                : "dark:text-slate-100"
            }
          >
            {todo.title}
          </span>
        </li>
      ))}
    </ul>
  );
});

export default TodoList;
