'use client'

import { Todo } from '@/lib/supabase'
import { format, isAfter, parseISO } from 'date-fns'

interface TodoItemProps {
  todo: Todo
  onToggleComplete: (todo: Todo) => void
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

export default function TodoItem({ todo, onToggleComplete, onEdit, onDelete }: TodoItemProps) {
  const dueDate = parseISO(todo.due_date)
  const isOverdue = !todo.completed && isAfter(new Date(), dueDate)

  return (
    <div className={`group relative bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
      isOverdue 
        ? 'border-red-300 shadow-red-100/50' 
        : todo.completed 
          ? 'border-green-300 shadow-green-100/50' 
          : 'border-white/20 shadow-xl'
    }`}>
      {/* Status indicator strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl sm:rounded-l-2xl ${
        isOverdue 
          ? 'bg-gradient-to-b from-red-500 to-red-600' 
          : todo.completed 
            ? 'bg-gradient-to-b from-green-500 to-green-600' 
            : 'bg-gradient-to-b from-blue-500 to-indigo-600'
      }`}></div>
      
      <div className="p-3 sm:p-4 lg:p-5 pl-4 sm:pl-5 lg:pl-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
            {/* Custom checkbox */}
            <div className="relative mt-1 flex-shrink-0">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={todo.completed}
                onChange={() => onToggleComplete(todo)}
                id={`todo-${todo.id}`}
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-blue-500 peer-focus:ring-2 peer-focus:ring-blue-500/20'
                }`}
              >
                {todo.completed && (
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </label>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-base sm:text-lg font-semibold transition-all duration-200 leading-tight ${
                todo.completed 
                  ? 'line-through text-gray-400' 
                  : 'text-gray-800 group-hover:text-blue-600'
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed ${
                  todo.completed 
                    ? 'line-through text-gray-400' 
                    : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                {/* Status badge */}
                <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium self-start ${
                  isOverdue 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : todo.completed 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${
                    isOverdue 
                      ? 'bg-red-500' 
                      : todo.completed 
                        ? 'bg-green-500' 
                        : 'bg-yellow-500'
                  }`}></div>
                  {isOverdue ? 'Overdue' : todo.completed ? 'Completed' : 'Pending'}
                </span>
                
                {/* Due date */}
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">Due {format(dueDate, 'MMM d, h:mm a')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions dropdown */}
          <div className="relative flex-shrink-0">
            <div className="dropdown dropdown-end">
              <label 
                tabIndex={0} 
                className="btn btn-ghost btn-sm w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-lg hover:bg-gray-100/80 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-all duration-200"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white border border-gray-100 rounded-xl w-32 sm:w-36">
                <li>
                  <button 
                    onClick={() => onEdit(todo)} 
                    className="text-xs sm:text-sm px-2 sm:px-3 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200 flex items-center space-x-1 sm:space-x-2"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onDelete(todo)} 
                    className="text-xs sm:text-sm px-2 sm:px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 flex items-center space-x-1 sm:space-x-2"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}