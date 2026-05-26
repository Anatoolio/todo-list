import { useState } from "react";
import { Plus } from "lucide-react";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";
import { useTodoStore } from "./stores/TodoStore";

const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function App() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addTodo = useTodoStore((s) => s.addTodo);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please enter a task");
      return;
    }
    addTodo(trimmed);
    setText("");
    setError(null);
  };

  const handleChange = (value: string) => {
    setText(value);
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-brand flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-white/25" />
      <div className="pointer-events-none absolute -top-40 -left-40 w-[24rem] h-[24rem] rounded-full bg-white/10" />

      <div className="relative w-full max-w-sm bg-surface rounded-[2rem] overflow-hidden shadow-2xl">
        <header className="bg-brand text-zinc-900 px-5 pt-6 pb-5 text-center">
          <h1 className="font-semibold tracking-wide">Todo List</h1>
        </header>

        <div className="px-5 pt-5 pb-24 min-h-[34rem] relative">
          <div className="mb-4">
            <h2 className="text-white font-semibold text-lg">Today</h2>
            <p className="text-zinc-500 text-xs mt-0.5">{today}</p>
          </div>

          <TodoFilter />
          <TodoInput value={text} error={error} onChange={handleChange} onSubmit={handleSubmit} />
          <TodoList />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          aria-label="Add"
          className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-brand text-zinc-900 flex items-center justify-center shadow-[0_8px_24px_rgba(93,190,163,0.45)] hover:bg-brand-dark active:scale-95 transition"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default App;
