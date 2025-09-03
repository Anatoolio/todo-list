import { createContext, useContext } from "react";
import { todoStore } from "./TodoStore";

export const StoreContext = createContext<{ todoStore: typeof todoStore }>({ todoStore });

export const useStores = () => useContext(StoreContext);
