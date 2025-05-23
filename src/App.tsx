import { useState } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { FilterTabs, type Filter} from './components/FilterTabs';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, addTodo, toggleTodo } = useTodos();
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <main>
      <h1>todos</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={filteredTodos} onToggle={toggleTodo} />
      <footer>
        <span>{todos.filter(t => !t.completed).length} items left</span>
        <FilterTabs filter={filter} setFilter={setFilter} />
      </footer>
    </main>
  );
}

export default App;
