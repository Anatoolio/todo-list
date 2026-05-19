import { useEffect, useRef, useState } from "react";
import {
  useTodoStore,
  selectRemaining,
  selectHasCompleted,
  type TodoFilterValue,
} from "../stores/todoStore";

const FILTERS: TodoFilterValue[] = ["all", "active", "completed"];
const NOTICE_TIMEOUT_MS = 2500;

function TodoFilter() {
  const filter = useTodoStore((s) => s.filter);
  const setFilter = useTodoStore((s) => s.setFilter);
  const clearCompleted = useTodoStore((s) => s.clearCompleted);
  const remaining = useTodoStore(selectRemaining);
  const hasCompleted = useTodoStore(selectHasCompleted);

  const [notice, setNotice] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleClearCompleted = () => {
    const cleared = clearCompleted();
    if (cleared > 0) {
      setNotice(`Cleared ${cleared} completed task${cleared === 1 ? "" : "s"}`);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setNotice(null), NOTICE_TIMEOUT_MS);
    }
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-500 text-xs">
          {remaining} item{remaining === 1 ? "" : "s"} left
        </span>
        <button
          type="button"
          onClick={handleClearCompleted}
          disabled={!hasCompleted}
          className="text-xs text-zinc-400 hover:text-brand disabled:text-zinc-700 disabled:hover:text-zinc-700 transition"
        >
          Clear completed
        </button>
      </div>
      <div className="flex gap-2" role="group" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
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
      <p role="status" aria-live="polite" className="text-brand text-xs mt-2 min-h-[1rem]">
        {notice ?? ""}
      </p>
    </div>
  );
}

export default TodoFilter;
