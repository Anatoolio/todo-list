package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    "os"
    "path/filepath"
    "time"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
    "github.com/go-chi/cors"
)

func main() {
    port := getenv("PORT", "8080")
    dbPath := getenv("DB_PATH", filepath.Join("data", "todos.db"))

    if err := os.MkdirAll(filepath.Dir(dbPath), 0o755); err != nil {
        log.Fatalf("mkdir data: %v", err)
    }

    db, err := openDB(dbPath)
    if err != nil {
        log.Fatalf("open db: %v", err)
    }
    defer db.Close()

    if err := migrate(db); err != nil {
        log.Fatalf("migrate: %v", err)
    }

    s := &Store{DB: db}

    r := chi.NewRouter()
    r.Use(middleware.RequestID)
    r.Use(middleware.RealIP)
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(cors.Handler(cors.Options{
        AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173"},
        AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
        ExposedHeaders:   []string{"Link"},
        AllowCredentials: false,
        MaxAge:           300,
    }))

    r.Route("/api", func(api chi.Router) {
        api.Get("/todos", s.ListTodos)
        api.Post("/todos", s.CreateTodo)
        api.Patch("/todos/{id}", s.UpdateTodo)
        api.Delete("/todos/{id}", s.DeleteTodo)
        api.Post("/todos/clear-completed", s.ClearCompleted)
    })

    log.Printf("db path: %s", dbPath)

    srv := &http.Server{
        Addr:              ":" + port,
        Handler:           r,
        ReadHeaderTimeout: 10 * time.Second,
    }
    log.Printf("listening on :%s", port)
    log.Fatal(srv.ListenAndServe())
}

func getenv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}
