import { useRef } from "react";
import TodoList from "./components/TodoList";
import TodoInput, { type TodoInputHandle } from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";

const formatToday = () =>
  new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

function App() {
  const inputRef = useRef<TodoInputHandle>(null);

  return (
    <div className="min-h-screen bg-brand flex items-center justify-center p-4 relative overflow-hidden">
      {/* decorative blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-white/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[24rem] h-[24rem] rounded-full bg-white/10"
      />

      {/* Phone card */}
      <div className="relative w-full max-w-sm bg-surface rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="bg-brand text-zinc-900 px-5 pt-6 pb-5 flex items-center justify-between">
          <button type="button" aria-label="Back" className="p-1 -ml-1 rounded hover:bg-black/10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="font-semibold tracking-wide">Todo List</h1>
          <button type="button" aria-label="Menu" className="p-1 -mr-1 rounded hover:bg-black/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="12" cy="19" r="1.6" />
            </svg>
          </button>
        </header>

        {/* Body */}
        <div className="px-5 pt-5 pb-24 min-h-[34rem] relative">
          <div className="mb-4">
            <h2 className="text-white font-semibold text-lg">Today</h2>
            <p className="text-zinc-500 text-xs mt-0.5">{formatToday()}</p>
          </div>

          <TodoFilter />
          <TodoInput ref={inputRef} />
          <TodoList />
        </div>

        {/* FAB */}
        <button
          type="button"
          onClick={() => inputRef.current?.submit()}
          aria-label="Add"
          className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-brand text-zinc-900 flex items-center justify-center shadow-[0_8px_24px_rgba(93,190,163,0.45)] hover:bg-brand-dark active:scale-95 transition"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
