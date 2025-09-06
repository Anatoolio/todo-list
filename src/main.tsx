import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Типизируем глобальный флаг, чтобы избежать any
declare global {
    // eslint-disable-next-line no-var
    var __USE_API__: boolean | undefined;
}

// Включаем API-режим, если Vite-переменная выставлена
if (import.meta.env?.VITE_USE_API === "true") {
    globalThis.__USE_API__ = true;
}

import("./App.tsx").then(({ default: App }) => {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
});
