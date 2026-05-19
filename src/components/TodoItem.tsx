import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTodoStore, type Todo } from "../stores/TodoStore";

interface Props {
  todo: Todo;
}

function TodoItem({ todo }: Props) {
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const editTodo = useTodoStore((s) => s.editTodo);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEdit = () => {
    setDraft(todo.title);
    setEditing(true);
  };

  const commit = () => {
    if (editTodo(todo.id, draft)) {
      setEditing(false);
    } else {
      removeTodo(todo.id);
    }
  };

  const cancel = () => {
    setDraft(todo.title);
    setEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit();
    else if (e.key === "Escape") cancel();
  };

  return (
    <li className="group flex items-center gap-3 px-4 py-3 bg-surface-raised rounded-lg mb-2">
      <label className="cursor-pointer flex-shrink-0">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="sr-only"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? "active" : "completed"}`}
        />
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition ${
            todo.completed ? "bg-brand border-brand" : "border-zinc-500 group-hover:border-zinc-300"
          }`}
        >
          {todo.completed && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 8.5 6.5 12 13 5" />
            </svg>
          )}
        </span>
      </label>

      {editing ? (
        <input
          ref={inputRef}
          className="flex-grow bg-transparent text-white text-sm outline-none border-b border-brand pb-0.5"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          aria-label={`Edit task "${todo.title}"`}
        />
      ) : (
        <span
          className={`flex-grow text-sm cursor-text select-none ${
            todo.completed ? "line-through text-zinc-600" : "text-white"
          }`}
          onDoubleClick={startEdit}
        >
          {todo.title}
        </span>
      )}

      {!editing && (
        <button
          type="button"
          onClick={startEdit}
          aria-label={`Edit "${todo.title}"`}
          className="text-zinc-500 hover:text-brand opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
        </button>
      )}
      <button
        type="button"
        onClick={() => removeTodo(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </li>
  );
}

export default TodoItem;
