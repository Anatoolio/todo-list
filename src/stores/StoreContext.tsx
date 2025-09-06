import { type ReactNode } from "react";
import { StoreContext } from "./context";
import { todoStore } from "./TodoStore";

export const StoreProvider = ({ children }: { children: ReactNode }) => (
    <StoreContext.Provider value={{ todoStore }}>{children}</StoreContext.Provider>
);
