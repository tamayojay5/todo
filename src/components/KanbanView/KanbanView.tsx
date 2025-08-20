'use client'

import { useState } from 'react'
import { Todo } from '@/lib/supabase'

interface KanbanViewProps {
  todos: Todo[]
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void
  onDeleteTodo: (id: string) => void
  className?: string
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900' }
]

const getColumnForTodo = (todo: Todo): string => {
  if (todo.completed) return 'done'
  if (todo.progress && todo.progress >= 75) return 'review'
  if (todo.progress && todo.progress > 0) return 'in_progress'
  return 'todo'
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
    case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20'
    default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800'
  }
}

export default function KanbanView({ todos, onUpdateTodo, onDeleteTodo, className = '' }: KanbanViewProps) {
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)

  const handleDragStart = (e: React.DragEvent, todo: Todo) => {
    setDraggedTodo(todo)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (!draggedTodo) return

    let updates: Partial<Todo> = {}
    
    switch (columnId) {
      case 'todo':
        updates = { progress: 0, completed: false }
        break
      case 'in_progress':
        updates = { progress: 25, completed: false }
        break
      case 'review':
        updates = { progress: 75, completed: false }
        break
      case 'done':
        updates = { progress: 100, completed: true }
        break
    }

    onUpdateTodo(draggedTodo.id, updates)
    setDraggedTodo(null)
  }

  const todosByColumn = columns.reduce((acc, column) => {
    acc[column.id] = todos.filter(todo => getColumnForTodo(todo) === column.id)
    return acc
  }, {} as Record<string, Todo[]>)

  return (
    <div className={`flex gap-6 overflow-x-auto pb-4 ${className}`}>
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className={`rounded-t-lg p-4 ${column.color}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {column.title}
              </h3>
              <span className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                {todosByColumn[column.id]?.length || 0}
              </span>
            </div>
          </div>

          {/* Column Content */}
          <div className="bg-white dark:bg-gray-900 rounded-b-lg border border-t-0 border-gray-200 dark:border-gray-700 min-h-96 p-4 space-y-3">
            {todosByColumn[column.id]?.map((todo) => (
              <div
                key={todo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, todo)}
                className={`p-4 rounded-lg border-l-4 cursor-move hover:shadow-md transition-shadow ${getPriorityColor(todo.priority || 'medium')}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                    {todo.title}
                  </h4>
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {todo.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
                    {todo.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    {/* Priority Badge */}
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      todo.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {todo.priority || 'medium'}
                    </span>

                    {/* Progress */}
                    <span className="text-gray-500 dark:text-gray-400">
                      {todo.progress || 0}%
                    </span>
                  </div>

                  {/* Due Date */}
                  <span className={`${
                    new Date(todo.due_date) < new Date() && !todo.completed
                      ? 'text-red-600 dark:text-red-400 font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(todo.due_date).toLocaleDateString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${todo.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {(!todosByColumn[column.id] || todosByColumn[column.id].length === 0) && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm">No tasks</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}