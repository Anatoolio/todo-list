import { observer } from "mobx-react-lite";
import { useStores } from "../stores/StoreContext";

const TodoFilter = observer(() => {
  const { todoStore } = useStores();
  const filters: ('all' | 'active' | 'completed')[] = ['all', 'active', 'completed'];

  return (
    <div className="flex justify-between items-center">
      <span>{todoStore.remaining} items left</span>
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            className={`px-2 py-1 border rounded ${
              todoStore.filter === f ? "bg-gray-300" : ""
            }`}
            onClick={() => todoStore.setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
});

export default TodoFilter;
