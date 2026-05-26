import {
  useTodoStore,
  selectRemaining,
  selectHasCompleted,
  type TodoFilterValue,
} from "../stores/TodoStore";

const FILTERS: TodoFilterValue[] = ["all", "active", "completed"];

function TodoFilter() {
  const filter = useTodoStore((s) => s.filter);
  const setFilter = useTodoStore((s) => s.setFilter);
  const clearCompleted = useTodoStore((s) => s.clearCompleted);
  const remaining = useTodoStore(selectRemaining);
  const hasCompleted = useTodoStore(selectHasCompleted);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-500 text-xs">
          {remaining} item{remaining === 1 ? "" : "s"} left
        </span>
        <button
          type="button"
          onClick={clearCompleted}
          disabled={!hasCompleted}
          className="text-xs text-zinc-400 hover:text-brand disabled:text-zinc-700 disabled:hover:text-zinc-700 transition"
        >
          Clear completed
        </button>
      </div>
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded-full capitalize transition ${
              filter === f
                ? "bg-brand text-zinc-900 font-medium"
                : "bg-surface-raised text-zinc-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TodoFilter;
