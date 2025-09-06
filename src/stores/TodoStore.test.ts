import { TodoStore } from "./TodoStore";

const getStored = () => {
    const raw = localStorage.getItem("todo-app/todos");
    return raw ? JSON.parse(raw) : null;
};

beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
});

test("adds, toggles, filters, remaining and clearCompleted", () => {
    const store = new TodoStore();

    expect(store.todos).toHaveLength(0);
    expect(store.remaining).toBe(0);

    store.addTodo("a");
    store.addTodo("b");
    expect(store.todos).toHaveLength(2);
    expect(store.remaining).toBe(2);

    // toggle first
    const firstId = store.todos[0].id;
    store.toggleTodo(firstId);
    expect(store.todos[0].completed).toBe(true);
    expect(store.remaining).toBe(1);

    // filters
    store.setFilter("active");
    expect(store.filteredTodos.map((t) => t.title)).toEqual(["b"]);
    store.setFilter("completed");
    expect(store.filteredTodos.map((t) => t.title)).toEqual(["a"]);
    store.setFilter("all");
    expect(store.filteredTodos.map((t) => t.title)).toEqual(["a", "b"]);

    // clear completed
    store.clearCompleted();
    expect(store.todos.map((t) => t.title)).toEqual(["b"]);
    expect(store.remaining).toBe(1);
});

test("persists changes to localStorage and survives errors", () => {
    const store = new TodoStore();
    // happy path: setItem called with serialized todos
    store.addTodo("persist me");
    const stored = getStored();
    expect(Array.isArray(stored)).toBe(true);
    expect(stored![0]).toMatchObject({ title: "persist me", completed: false });

    // simulate storage error; should not throw
    const spy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("fail");
    });
    expect(() => store.addTodo("no crash")).not.toThrow();
    spy.mockRestore();
});

test("loads from localStorage and sets nextId correctly", () => {
    const preload = [
        { id: 5, title: "old 1", completed: false },
        { id: 7, title: "old 2", completed: true },
    ];
    localStorage.setItem("todo-app/todos", JSON.stringify(preload));

    const store = new TodoStore();
    expect(store.todos.map((t) => t.title)).toEqual(["old 1", "old 2"]);
    // next add should use id 8
    store.addTodo("new");
    expect(store.todos.find((t) => t.title === "new")!.id).toBe(8);
});
