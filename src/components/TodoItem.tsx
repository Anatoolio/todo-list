import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
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
    const trimmed = draft.trim();
    if (trimmed) editTodo(todo.id, trimmed);
    setEditing(false);
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
        />
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition ${
            todo.completed ? "bg-brand border-brand" : "border-zinc-500 group-hover:border-zinc-300"
          }`}
        >
          {todo.completed && <Check size={12} strokeWidth={3} className="text-zinc-900" />}
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
          className={`flex-grow text-sm select-none ${
            todo.completed ? "line-through text-zinc-600" : "text-white"
          }`}
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
          <Pencil size={14} />
        </button>
      )}
      <button
        type="button"
        onClick={() => removeTodo(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}

export default TodoItem;
