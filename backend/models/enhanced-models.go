package models

import (
	"time"
	"encoding/json"
)

type EnhancedTodo struct {
	ID               string                 `json:"id" db:"id"`
	Title            string                 `json:"title" db:"title"`
	Description      *string                `json:"description" db:"description"`
	DueDate          time.Time              `json:"due_date" db:"due_date"`
	Completed        bool                   `json:"completed" db:"completed"`
	Priority         string                 `json:"priority" db:"priority"` // low, medium, high
	CategoryID       *string                `json:"category_id" db:"category_id"`
	ParentID         *string                `json:"parent_id" db:"parent_id"`
	IsRecurring      bool                   `json:"is_recurring" db:"is_recurring"`
	RecurrencePattern json.RawMessage       `json:"recurrence_pattern" db:"recurrence_pattern"`
	EstimatedTime    *int                   `json:"estimated_time" db:"estimated_time"` // minutes
	ActualTime       *int                   `json:"actual_time" db:"actual_time"`       // minutes
	Progress         int                    `json:"progress" db:"progress"`             // 0-100
	UserID           string                 `json:"user_id" db:"user_id"`
	CreatedAt        time.Time              `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time              `json:"updated_at" db:"updated_at"`
	
	// Joined fields
	Category         *Category              `json:"category,omitempty"`
	Tags             []Tag                  `json:"tags,omitempty"`
	Subtasks         []EnhancedTodo         `json:"subtasks,omitempty"`
}

type Category struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Color     string    `json:"color" db:"color"`
	Icon      *string   `json:"icon" db:"icon"`
	UserID    string    `json:"user_id" db:"user_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type Tag struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Color     string    `json:"color" db:"color"`
	UserID    string    `json:"user_id" db:"user_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Template struct {
	ID           string          `json:"id" db:"id"`
	Name         string          `json:"name" db:"name"`
	Description  *string         `json:"description" db:"description"`
	Category     string          `json:"category" db:"category"`
	TemplateData json.RawMessage `json:"template_data" db:"template_data"`
	IsPublic     bool            `json:"is_public" db:"is_public"`
	UserID       string          `json:"user_id" db:"user_id"`
	UsageCount   int             `json:"usage_count" db:"usage_count"`
	CreatedAt    time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at" db:"updated_at"`
}

type CreateEnhancedTodoRequest struct {
	Title            string          `json:"title"`
	Description      *string         `json:"description"`
	DueDate          time.Time       `json:"due_date"`
	Priority         *string         `json:"priority"`
	CategoryID       *string         `json:"category_id"`
	ParentID         *string         `json:"parent_id"`
	EstimatedTime    *int            `json:"estimated_time"`
	Tags             []string        `json:"tags"`
	IsRecurring      *bool           `json:"is_recurring"`
	RecurrencePattern json.RawMessage `json:"recurrence_pattern"`
}

type UpdateEnhancedTodoRequest struct {
	Title            *string         `json:"title"`
	Description      *string         `json:"description"`
	DueDate          *time.Time      `json:"due_date"`
	Completed        *bool           `json:"completed"`
	Priority         *string         `json:"priority"`
	CategoryID       *string         `json:"category_id"`
	EstimatedTime    *int            `json:"estimated_time"`
	ActualTime       *int            `json:"actual_time"`
	Progress         *int            `json:"progress"`
	Tags             []string        `json:"tags"`
}

type CreateCategoryRequest struct {
	Name  string  `json:"name"`
	Color *string `json:"color"`
	Icon  *string `json:"icon"`
}

type CreateTagRequest struct {
	Name  string  `json:"name"`
	Color *string `json:"color"`
}

type SearchFilters struct {
	Query      string     `json:"query"`
	Priority   []string   `json:"priority"`
	Categories []string   `json:"categories"`
	Tags       []string   `json:"tags"`
	Completed  *bool      `json:"completed"`
	DateFrom   *time.Time `json:"date_from"`
	DateTo     *time.Time `json:"date_to"`
}

type RecurrencePattern struct {
	Type     string `json:"type"`     // daily, weekly, monthly, yearly
	Interval int    `json:"interval"` // every N days/weeks/months
	EndDate  *time.Time `json:"end_date,omitempty"`
	DaysOfWeek []int `json:"days_of_week,omitempty"` // 0=Sunday, 1=Monday, etc.
}