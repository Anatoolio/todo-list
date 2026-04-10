import { observer } from "mobx-react-lite";
import { StoreProvider } from "./stores/StoreContext";
import { useStores } from "./stores/context";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";

const AppContent = observer(() => {
    const { todoStore } = useStores();
    return (
        <div className="max-w-xl mx-auto mt-10 p-4 shadow-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-4">todos</h1>
            {todoStore.isLoading && <p className="text-center text-slate-500 mb-4">Loading...</p>}
            {todoStore.error && <p className="text-center text-red-500 mb-4">{todoStore.error}</p>}
            <TodoInput />
            <TodoList />
            <TodoFilter />
        </div>
    );
});

function App() {
    return (
        <StoreProvider>
            <AppContent />
        </StoreProvider>
    );
}

export default App;
