import { useTodoStore, resetTodoStore, STORAGE_KEY } from "./todoStore";

beforeEach(() => {
  localStorage.clear();
  resetTodoStore();
});

test("addTodo trims, rejects empty/whitespace, returns boolean", () => {
  const { addTodo } = useTodoStore.getState();
  expect(addTodo("")).toBe(false);
  expect(addTodo("   ")).toBe(false);
  expect(useTodoStore.getState().todos).toHaveLength(0);

  expect(addTodo("  hello  ")).toBe(true);
  expect(useTodoStore.getState().todos[0].title).toBe("hello");
});

test("toggle, remove, filter, remaining, clearCompleted", () => {
  const { addTodo, toggleTodo, removeTodo, setFilter, clearCompleted } = useTodoStore.getState();

  addTodo("a");
  addTodo("b");
  addTodo("c");

  const ids = useTodoStore.getState().todos.map((t) => t.id);
  toggleTodo(ids[0]);
  expect(useTodoStore.getState().todos[0].completed).toBe(true);

  setFilter("active");
  let state = useTodoStore.getState();
  expect(state.todos.filter((t) => !t.completed).map((t) => t.title)).toEqual(["b", "c"]);

  removeTodo(ids[1]);
  state = useTodoStore.getState();
  expect(state.todos.map((t) => t.title)).toEqual(["a", "c"]);

  toggleTodo(ids[2]);
  expect(clearCompleted()).toBe(2);
  expect(useTodoStore.getState().todos).toHaveLength(0);
  expect(clearCompleted()).toBe(0);
});

test("editTodo trims and rejects empty", () => {
  const { addTodo, editTodo } = useTodoStore.getState();
  addTodo("original");
  const id = useTodoStore.getState().todos[0].id;

  expect(editTodo(id, "")).toBe(false);
  expect(editTodo(id, "   ")).toBe(false);
  expect(useTodoStore.getState().todos[0].title).toBe("original");

  expect(editTodo(id, "  updated  ")).toBe(true);
  expect(useTodoStore.getState().todos[0].title).toBe("updated");
});

test("persists state to localStorage", () => {
  useTodoStore.getState().addTodo("persist me");

  const raw = localStorage.getItem(STORAGE_KEY);
  expect(raw).not.toBeNull();
  const parsed = JSON.parse(raw!);
  expect(parsed.state.todos[0]).toMatchObject({ title: "persist me", completed: false });
  expect(parsed.state.nextId).toBe(2);
});
