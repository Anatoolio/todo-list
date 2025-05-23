import React, { createContext, useContext } from "react";
import { todoStore } from "./TodoStore";

const StoreContext = createContext({ todoStore });

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreContext.Provider value={{ todoStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => useContext(StoreContext);
