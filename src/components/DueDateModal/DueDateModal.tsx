'use client'

import { Todo } from '@/lib/supabase'
import { format, parseISO } from 'date-fns'

interface DueDateModalProps {
  isOpen: boolean
  todos: Todo[]
  onClose: () => void
}

export default function DueDateModal({ isOpen, todos, onClose }: DueDateModalProps) {

  if (!isOpen || todos.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-red-200 w-full max-w-sm sm:max-w-lg max-h-[95vh] sm:max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {todos.length === 1 ? 'Task Overdue!' : `${todos.length} Tasks Overdue!`}
              </h3>
              <p className="text-red-100 text-xs sm:text-sm">
                Immediate attention required
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              The following {todos.length === 1 ? 'task has' : 'tasks have'} passed {todos.length === 1 ? 'its' : 'their'} due date and require your immediate attention:
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-60 overflow-y-auto">
            {todos.map(todo => (
              <div key={todo.id} className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 relative overflow-hidden">
                {/* Overdue indicator strip */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-l-xl sm:rounded-l-2xl"></div>
                
                <div className="pl-2 sm:pl-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3 gap-2">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">{todo.title}</h4>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 self-start">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
                      Overdue
                    </span>
                  </div>
                  
                  {todo.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-red-600 font-medium">
                      Due: {format(parseISO(todo.due_date), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50/50 backdrop-blur-lg p-4 sm:p-6 border-t border-gray-200/50">
          <button 
            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2 text-sm sm:text-base"
            onClick={onClose}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Got it, thanks!</span>
          </button>
        </div>
      </div>
    </div>
  )
}