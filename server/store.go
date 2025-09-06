package main

import (
    "database/sql"
    "errors"
    "fmt"
    "time"

    _ "modernc.org/sqlite"
)

type Todo struct {
    ID        int64     `json:"id"`
    Title     string    `json:"title"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"createdAt"`
}

type Store struct {
    DB *sql.DB
}

func openDB(path string) (*sql.DB, error) {
    db, err := sql.Open("sqlite", path)
    if err != nil {
        return nil, err
    }
    if err := db.Ping(); err != nil {
        db.Close()
        return nil, err
    }
    return db, nil
}

func migrate(db *sql.DB) error {
    _, err := db.Exec(`
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`)
    return err
}

func (s *Store) AllTodos(filter string) ([]Todo, error) {
    q := "SELECT id, title, completed, created_at FROM todos"
    switch filter {
    case "active":
        q += " WHERE completed = 0"
    case "completed":
        q += " WHERE completed = 1"
    }
    q += " ORDER BY id ASC"

    rows, err := s.DB.Query(q)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var list []Todo
    for rows.Next() {
        var t Todo
        var completed int
        var createdAt any
        if err := rows.Scan(&t.ID, &t.Title, &completed, &createdAt); err != nil {
            return nil, err
        }
        t.Completed = completed == 1
        switch v := createdAt.(type) {
        case time.Time:
            t.CreatedAt = v
        case string:
            // Try to parse common SQLite datetime formats; ignore on failure
            if ts, err := time.Parse(time.RFC3339Nano, v); err == nil {
                t.CreatedAt = ts
            }
        case []byte:
            // SQLite may return TEXT as []byte
            if ts, err := time.Parse(time.RFC3339Nano, string(v)); err == nil {
                t.CreatedAt = ts
            }
        }
        list = append(list, t)
    }
    return list, rows.Err()
}

func (s *Store) InsertTodo(title string) (Todo, error) {
    res, err := s.DB.Exec("INSERT INTO todos(title, completed) VALUES(?, 0)", title)
    if err != nil {
        return Todo{}, err
    }
    id, _ := res.LastInsertId()
    t := Todo{ID: id, Title: title, Completed: false, CreatedAt: time.Now()}
    return t, nil
}

func (s *Store) SetCompleted(id int64, completed bool) error {
    v := 0
    if completed {
        v = 1
    }
    res, err := s.DB.Exec("UPDATE todos SET completed = ? WHERE id = ?", v, id)
    if err != nil {
        return err
    }
    n, _ := res.RowsAffected()
    if n == 0 {
        return errors.New("not found")
    }
    return nil
}

func (s *Store) UpdateTitle(id int64, title string) error {
    res, err := s.DB.Exec("UPDATE todos SET title = ? WHERE id = ?", title, id)
    if err != nil {
        return err
    }
    n, _ := res.RowsAffected()
    if n == 0 {
        return errors.New("not found")
    }
    return nil
}

func (s *Store) Delete(id int64) error {
    res, err := s.DB.Exec("DELETE FROM todos WHERE id = ?", id)
    if err != nil {
        return err
    }
    n, _ := res.RowsAffected()
    if n == 0 {
        return fmt.Errorf("todo %d not found", id)
    }
    return nil
}

func (s *Store) ClearCompleted() error {
    _, err := s.DB.Exec("DELETE FROM todos WHERE completed = 1")
    return err
}
