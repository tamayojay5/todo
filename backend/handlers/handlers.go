package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"todo-backend/database"
	"todo-backend/models"
)

func GetTodos(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "User ID required", http.StatusUnauthorized)
		return
	}

	rows, err := database.DB.Query(`
		SELECT id, title, description, due_date, completed, user_id, created_at, updated_at 
		FROM todos 
		WHERE user_id = $1 
		ORDER BY due_date ASC
	`, userID)
	if err != nil {
		http.Error(w, "Failed to fetch todos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var todo models.Todo
		err := rows.Scan(
			&todo.ID,
			&todo.Title,
			&todo.Description,
			&todo.DueDate,
			&todo.Completed,
			&todo.UserID,
			&todo.CreatedAt,
			&todo.UpdatedAt,
		)
		if err != nil {
			http.Error(w, "Failed to scan todo", http.StatusInternalServerError)
			return
		}
		todos = append(todos, todo)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func CreateTodo(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "User ID required", http.StatusUnauthorized)
		return
	}

	var req models.CreateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	var todo models.Todo
	err := database.DB.QueryRow(`
		INSERT INTO todos (title, description, due_date, user_id) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id, title, description, due_date, completed, user_id, created_at, updated_at
	`, req.Title, req.Description, req.DueDate, userID).Scan(
		&todo.ID,
		&todo.Title,
		&todo.Description,
		&todo.DueDate,
		&todo.Completed,
		&todo.UserID,
		&todo.CreatedAt,
		&todo.UpdatedAt,
	)
	if err != nil {
		http.Error(w, "Failed to create todo", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(todo)
}

func UpdateTodo(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "User ID required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	todoID := vars["id"]

	var req models.UpdateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	query := "UPDATE todos SET updated_at = NOW()"
	args := []interface{}{}
	argCount := 0

	if req.Title != nil {
		argCount++
		query += ", title = $" + string(rune(argCount+'0'))
		args = append(args, *req.Title)
	}
	if req.Description != nil {
		argCount++
		query += ", description = $" + string(rune(argCount+'0'))
		args = append(args, *req.Description)
	}
	if req.DueDate != nil {
		argCount++
		query += ", due_date = $" + string(rune(argCount+'0'))
		args = append(args, *req.DueDate)
	}
	if req.Completed != nil {
		argCount++
		query += ", completed = $" + string(rune(argCount+'0'))
		args = append(args, *req.Completed)
	}

	argCount++
	query += " WHERE id = $" + string(rune(argCount+'0'))
	args = append(args, todoID)
	
	argCount++
	query += " AND user_id = $" + string(rune(argCount+'0'))
	args = append(args, userID)

	query += " RETURNING id, title, description, due_date, completed, user_id, created_at, updated_at"

	var todo models.Todo
	err := database.DB.QueryRow(query, args...).Scan(
		&todo.ID,
		&todo.Title,
		&todo.Description,
		&todo.DueDate,
		&todo.Completed,
		&todo.UserID,
		&todo.CreatedAt,
		&todo.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Todo not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to update todo", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

func DeleteTodo(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "User ID required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	todoID := vars["id"]

	result, err := database.DB.Exec("DELETE FROM todos WHERE id = $1 AND user_id = $2", todoID, userID)
	if err != nil {
		http.Error(w, "Failed to delete todo", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "Failed to check delete result", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}