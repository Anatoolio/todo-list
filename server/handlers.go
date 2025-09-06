package main

import (
    "encoding/json"
    "net/http"
    "strconv"

    "github.com/go-chi/chi/v5"
)

func writeJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    _ = json.NewEncoder(w).Encode(v)
}

func parseIDParam(r *http.Request) (int64, error) {
    idStr := chi.URLParam(r, "id")
    return strconv.ParseInt(idStr, 10, 64)
}

// GET /api/todos?filter=all|active|completed
func (s *Store) ListTodos(w http.ResponseWriter, r *http.Request) {
    filter := r.URL.Query().Get("filter")
    items, err := s.AllTodos(filter)
    if err != nil {
        writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
        return
    }
    writeJSON(w, http.StatusOK, items)
}

type createTodoReq struct {
    Title string `json:"title"`
}

// POST /api/todos
func (s *Store) CreateTodo(w http.ResponseWriter, r *http.Request) {
    var req createTodoReq
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Title == "" {
        writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
        return
    }
    t, err := s.InsertTodo(req.Title)
    if err != nil {
        writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
        return
    }
    writeJSON(w, http.StatusCreated, t)
}

type updateTodoReq struct {
    Title     *string `json:"title,omitempty"`
    Completed *bool   `json:"completed,omitempty"`
}

// PATCH /api/todos/{id}
func (s *Store) UpdateTodo(w http.ResponseWriter, r *http.Request) {
    id, err := parseIDParam(r)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
        return
    }
    var req updateTodoReq
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
        return
    }
    if req.Title != nil {
        if err := s.UpdateTitle(id, *req.Title); err != nil {
            writeJSON(w, http.StatusNotFound, map[string]string{"error": err.Error()})
            return
        }
    }
    if req.Completed != nil {
        if err := s.SetCompleted(id, *req.Completed); err != nil {
            writeJSON(w, http.StatusNotFound, map[string]string{"error": err.Error()})
            return
        }
    }
    writeJSON(w, http.StatusNoContent, map[string]any{"ok": true})
}

// DELETE /api/todos/{id}
func (s *Store) DeleteTodo(w http.ResponseWriter, r *http.Request) {
    id, err := parseIDParam(r)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
        return
    }
    if err := s.Delete(id); err != nil {
        writeJSON(w, http.StatusNotFound, map[string]string{"error": err.Error()})
        return
    }
    writeJSON(w, http.StatusNoContent, map[string]any{"ok": true})
}

// POST /api/todos/clear-completed
func (s *Store) ClearCompleted(w http.ResponseWriter, r *http.Request) {
    if err := s.ClearCompleted(); err != nil {
        writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
        return
    }
    writeJSON(w, http.StatusNoContent, map[string]any{"ok": true})
}

