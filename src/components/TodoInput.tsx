import { useState } from "react";
import { useStores } from "../stores/StoreContext";

export default function TodoInput() {
  const [text, setText] = useState("");
  const { todoStore } = useStores();

  const add = () => {
    if (text.trim()) {
      todoStore.addTodo(text.trim());
      setText("");
    }
  };

  return (
    <div className="mb-4 flex">
      <input
        className="border px-2 py-1 flex-grow rounded-l"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        onKeyDown={(e) => e.key === "Enter" && add()}
      />
      <button onClick={add} className="bg-blue-500 text-white px-4 rounded-r">
        Add
      </button>
    </div>
  );
}
