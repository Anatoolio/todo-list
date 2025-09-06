import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoreContext } from "../stores/context";
import { TodoStore } from "../stores/TodoStore";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import TodoFilter from "./TodoFilter";

beforeEach(() => {
    localStorage.clear();
});

function renderWithStore(store = new TodoStore()) {
    return render(
        <StoreContext.Provider value={{ todoStore: store }}>
            <div>
                <h1>todos</h1>
                <TodoInput />
                <TodoList />
                <TodoFilter />
            </div>
        </StoreContext.Provider>
    );
}

test("renders and adds/toggles todos via UI", async () => {
    const user = userEvent.setup();
    renderWithStore();

    // heading
    expect(screen.getByRole("heading", { name: /todos/i })).toBeInTheDocument();

    const input = screen.getByPlaceholderText("What needs to be done?") as HTMLInputElement;
    const addBtn = screen.getByRole("button", { name: /add/i });

    await user.type(input, "Task 1");
    await user.click(addBtn);
    await user.type(input, "Task 2{enter}");

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText(/items left/i)).toHaveTextContent("2");

    // toggle first item
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    await user.click(checkboxes[0]);
    expect(screen.getByText("Task 1").className).toMatch(/line-through/);
    expect(screen.getByText(/items left/i)).toHaveTextContent("1");
});

test("filters and clears completed", async () => {
    const user = userEvent.setup();
    renderWithStore();

    const input = screen.getByPlaceholderText("What needs to be done?");
    await user.type(input, "A{enter}");
    await user.type(input, "B{enter}");

    // complete A
    const [aCheckbox] = screen.getAllByRole("checkbox");
    await user.click(aCheckbox);

    const getItems = () => screen.getAllByRole("listitem");
    expect(getItems()).toHaveLength(2);

    // filter active
    await user.click(screen.getByRole("button", { name: /^active$/i }));
    expect(getItems()).toHaveLength(1);
    expect(screen.getByText("B")).toBeInTheDocument();

    // filter completed
    await user.click(screen.getByRole("button", { name: /^completed$/i }));
    expect(getItems()).toHaveLength(1);
    expect(screen.getByText("A")).toBeInTheDocument();

    // back to all
    await user.click(screen.getByRole("button", { name: /^all$/i }));
    expect(getItems()).toHaveLength(2);

    // clear completed
    const clearBtn = screen.getByRole("button", { name: /clear completed/i });
    expect(clearBtn).not.toBeDisabled();
    await user.click(clearBtn);
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.getByText(/items left/i)).toHaveTextContent("1");
    expect(clearBtn).toBeDisabled();
});

test("hydrates from localStorage on load", async () => {
    // preload storage then create a store which hydrates on ctor
    localStorage.setItem(
        "todo-app/todos",
        JSON.stringify([
            { id: 1, title: "From storage", completed: false },
            { id: 2, title: "Done", completed: true },
        ])
    );
    const store = new TodoStore();
    renderWithStore(store);

    // should render 2 items
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(screen.getByText("From storage")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
});
