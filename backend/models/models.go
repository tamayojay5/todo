package models

import "time"

type Todo struct {
	ID          string    `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Description *string   `json:"description" db:"description"`
	DueDate     time.Time `json:"due_date" db:"due_date"`
	Completed   bool      `json:"completed" db:"completed"`
	UserID      string    `json:"user_id" db:"user_id"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type CreateTodoRequest struct {
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	DueDate     time.Time `json:"due_date"`
}

type UpdateTodoRequest struct {
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	DueDate     *time.Time `json:"due_date"`
	Completed   *bool      `json:"completed"`
}