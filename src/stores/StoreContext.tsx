import { createContext, useContext, type ReactNode } from "react";
import { todoStore } from "./TodoStore";

export const StoreContext = createContext<{ todoStore: typeof todoStore }>({ todoStore });

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <StoreContext.Provider value={{ todoStore }}>{children}</StoreContext.Provider>;
};

export const useStores = () => useContext(StoreContext);
