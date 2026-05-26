import { useTodoStore, STORAGE_KEY } from "./TodoStore";

beforeEach(() => {
  localStorage.clear();
  useTodoStore.setState({ todos: [], filter: "all" });
});

test("toggle, remove, filter, clearCompleted", () => {
  const { addTodo, toggleTodo, removeTodo, setFilter, clearCompleted } = useTodoStore.getState();

  addTodo("a");
  addTodo("b");
  addTodo("c");

  const ids = useTodoStore.getState().todos.map((t) => t.id);
  toggleTodo(ids[0]);
  expect(useTodoStore.getState().todos[0].completed).toBe(true);

  setFilter("active");
  expect(
    useTodoStore
      .getState()
      .todos.filter((t) => !t.completed)
      .map((t) => t.title)
  ).toEqual(["b", "c"]);

  removeTodo(ids[1]);
  expect(useTodoStore.getState().todos.map((t) => t.title)).toEqual(["a", "c"]);

  toggleTodo(ids[2]);
  clearCompleted();
  expect(useTodoStore.getState().todos).toHaveLength(0);
});

test("persists todos to localStorage", () => {
  useTodoStore.getState().addTodo("persist me");

  const raw = localStorage.getItem(STORAGE_KEY);
  expect(raw).not.toBeNull();
  const parsed = JSON.parse(raw!);
  expect(parsed.state.todos[0]).toMatchObject({ title: "persist me", completed: false });
});
