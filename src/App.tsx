import { StoreProvider } from "./stores/StoreContext";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";

function App() {
    return (
        <StoreProvider>
            <div className="max-w-xl mx-auto mt-10 p-4 shadow-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-4">todos</h1>
                <TodoInput />
                <TodoList />
                <TodoFilter />
            </div>
        </StoreProvider>
    );
}

export default App;
