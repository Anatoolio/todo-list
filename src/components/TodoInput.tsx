import type { KeyboardEvent } from "react";

interface Props {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function TodoInput({ value, error, onChange, onSubmit }: Props) {
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="What needs to be done?"
          aria-label="New task"
          aria-invalid={error ? true : undefined}
        />
      </div>
      {error && (
        <p role="alert" className="text-red-400 text-xs mt-1.5 ml-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default TodoInput;
