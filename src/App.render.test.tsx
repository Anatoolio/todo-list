import { render, screen } from "@testing-library/react";
import App from "./App";

test("App renders with StoreProvider", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /todos/i })).toBeInTheDocument();
});
