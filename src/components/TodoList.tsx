import { observer } from "mobx-react-lite";
import { useStores } from "../stores/context";

const TodoList = observer(() => {
  const { todoStore } = useStores();

  return (
    <ul className="mb-4">
      {todoStore.filteredTodos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-2 py-1 cursor-pointer"
          onClick={() => todoStore.toggleTodo(todo.id)}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onClick={(e) => e.stopPropagation()}
            onChange={() => todoStore.toggleTodo(todo.id)}
          />
          <span className={todo.completed ? "line-through text-gray-400" : ""}>{todo.title}</span>
        </li>
      ))}
    </ul>
  );
});

export default TodoList;
