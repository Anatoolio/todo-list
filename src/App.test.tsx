import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTodoStore } from "./stores/TodoStore";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
  useTodoStore.setState({ todos: [], filter: "all" });
});

const getInput = () => screen.getByPlaceholderText("What needs to be done?") as HTMLInputElement;

test("adds todos via Enter and via Add button", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(getInput(), "Task 1{enter}");
  await user.type(getInput(), "Task 2");
  await user.click(screen.getByRole("button", { name: /^add$/i }));

  expect(screen.getByText("Task 1")).toBeInTheDocument();
  expect(screen.getByText("Task 2")).toBeInTheDocument();
  expect(getInput().value).toBe("");
  expect(screen.getByText(/items left/i)).toHaveTextContent("2");
});

test("shows error on empty submit and clears it when typing", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(getInput());
  await user.keyboard("{Enter}");
  expect(screen.getByRole("alert")).toHaveTextContent(/please enter a task/i);

  await user.type(getInput(), "real task");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("toggles a todo and updates remaining count", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(getInput(), "Task 1{enter}");
  await user.type(getInput(), "Task 2{enter}");

  const [first] = screen.getAllByRole("checkbox") as HTMLInputElement[];
  await user.click(first);

  expect(screen.getByText("Task 1").className).toMatch(/line-through/);
  expect(screen.getByText(/item.*left/i)).toHaveTextContent("1");
});

test("filters tasks by active, completed, all", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(getInput(), "A{enter}");
  await user.type(getInput(), "B{enter}");
  await user.click((screen.getAllByRole("checkbox") as HTMLInputElement[])[0]);

  const getItems = () => screen.getAllByRole("listitem");
  expect(getItems()).toHaveLength(2);

  await user.click(screen.getByRole("button", { name: /^active$/i }));
  expect(getItems()).toHaveLength(1);
  expect(screen.getByText("B")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /^completed$/i }));
  expect(getItems()).toHaveLength(1);
  expect(screen.getByText("A")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /^all$/i }));
  expect(getItems()).toHaveLength(2);
});

test("clears completed tasks", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(getInput(), "A{enter}");
  await user.type(getInput(), "B{enter}");

  const clearBtn = screen.getByRole("button", { name: /clear completed/i });
  expect(clearBtn).toBeDisabled();

  const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
  await user.click(checkboxes[0]);
  await user.click(checkboxes[1]);

  expect(clearBtn).not.toBeDisabled();
  await user.click(clearBtn);

  expect(screen.queryByText("A")).not.toBeInTheDocument();
  expect(screen.queryByText("B")).not.toBeInTheDocument();
  expect(clearBtn).toBeDisabled();
});

test("deletes a single todo via Delete button", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(getInput(), "Keep{enter}");
  await user.type(getInput(), "Remove{enter}");

  await user.click(screen.getByRole("button", { name: /delete "Remove"/i }));

  expect(screen.queryByText("Remove")).not.toBeInTheDocument();
  expect(screen.getByText("Keep")).toBeInTheDocument();
  expect(screen.getByText(/item.*left/i)).toHaveTextContent("1");
});

test("edits a todo: Enter commits, Escape cancels", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(getInput(), "Original{enter}");

  await user.click(screen.getByRole("button", { name: /edit "Original"/i }));
  const editInput = screen.getByRole("textbox", { name: /edit task "Original"/i });
  await user.clear(editInput);
  await user.type(editInput, "Renamed{enter}");
  expect(screen.getByText("Renamed")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /edit "Renamed"/i }));
  const editInput2 = screen.getByRole("textbox", { name: /edit task "Renamed"/i });
  await user.clear(editInput2);
  await user.type(editInput2, "Should be discarded{escape}");
  expect(screen.getByText("Renamed")).toBeInTheDocument();
});

test("editing to empty title keeps the original", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(getInput(), "Original{enter}");

  await user.click(screen.getByRole("button", { name: /edit "Original"/i }));
  const editInput = screen.getByRole("textbox", { name: /edit task/i });
  await user.clear(editInput);
  await user.keyboard("{Enter}");

  expect(screen.getByText("Original")).toBeInTheDocument();
});

test("hydrates from localStorage on load", () => {
  localStorage.setItem(
    "todo-app/todos",
    JSON.stringify({
      state: {
        todos: [
          { id: "a", title: "From storage", completed: false, createdAt: 1 },
          { id: "b", title: "Done", completed: true, createdAt: 2 },
        ],
      },
      version: 0,
    })
  );
  useTodoStore.persist.rehydrate();

  render(<App />);

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByText("From storage")).toBeInTheDocument();
  expect(screen.getByText("Done")).toBeInTheDocument();
});
