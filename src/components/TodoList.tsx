import { observer } from "mobx-react-lite";
import { useStores } from "../stores/context";

const TodoList = observer(() => {
    const { todoStore } = useStores();

    return (
        <ul className="mb-4">
            {todoStore.filteredTodos.map((todo) => (
                <li key={todo.id} className="flex items-center gap-2 py-1 group">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => todoStore.toggleTodo(todo.id)}
                        aria-label={`Mark "${todo.title}" as ${todo.completed ? "active" : "completed"}`}
                    />
                    <span
                        className={`flex-grow ${todo.completed ? "line-through text-gray-400" : ""}`}
                    >
                        {todo.title}
                    </span>
                    <button
                        onClick={() => todoStore.deleteTodo(todo.id)}
                        aria-label={`Delete "${todo.title}"`}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity px-1"
                    >
                        ✕
                    </button>
                </li>
            ))}
        </ul>
    );
});

export default TodoList;
