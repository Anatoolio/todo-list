import { forwardRef, useImperativeHandle, useState, type KeyboardEvent } from "react";
import { useTodoStore } from "../stores/todoStore";

const EMPTY_ERROR = "Please enter a task";

export interface TodoInputHandle {
  submit: () => void;
}

const TodoInput = forwardRef<TodoInputHandle>(function TodoInput(_, ref) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addTodo = useTodoStore((s) => s.addTodo);

  const submit = () => {
    if (!addTodo(text)) {
      setError(EMPTY_ERROR);
      return;
    }
    setText("");
    setError(null);
  };

  useImperativeHandle(ref, () => ({ submit }));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="mb-3">
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-surface-raised rounded-lg ring-1 transition ${
          error ? "ring-red-500/70" : "ring-white/5 focus-within:ring-brand/60"
        }`}
      >
        <input
          type="text"
          className="bg-transparent flex-grow text-white placeholder-zinc-500 outline-none text-sm"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={onKeyDown}
          placeholder="What needs to be done?"
          aria-label="New task"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "todo-input-error" : undefined}
        />
      </div>
      {error && (
        <p id="todo-input-error" role="alert" className="text-red-400 text-xs mt-1.5 ml-1">
          {error}
        </p>
      )}
    </div>
  );
});

export default TodoInput;
