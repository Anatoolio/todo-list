import { useState } from 'react';

export function TodoInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <input
      className="todo-input"
      placeholder="What needs to be done?"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}