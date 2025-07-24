'use client'

import { Todo } from '@/lib/supabase'
import { format, parseISO } from 'date-fns'
import { useState, useEffect } from 'react'

interface TodoDetailsModalProps {
  todo: Todo | null
  isOpen: boolean
  onClose: () => void
  onSave: (todoData: {
    title: string
    description?: string
    due_date: string
  }) => Promise<void>
}

export default function TodoDetailsModal({ todo, isOpen, onClose, onSave }: TodoDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  // Update form when todo changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setDescription(todo.description || '')
      // Convert UTC to local time for datetime-local input
      const localDate = new Date(todo.due_date)
      const offset = localDate.getTimezoneOffset() * 60000
      const localISOTime = new Date(localDate.getTime() - offset).toISOString().slice(0, 16)
      setDueDate(localISOTime)
    }
  }, [todo])

  const handleSave = async () => {
    if (!title.trim()) return
    
    setLoading(true)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: new Date(dueDate).toISOString(),
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (todo) {
      setTitle(todo.title)
      setDescription(todo.description || '')
      // Convert UTC to local time for datetime-local input
      const localDate = new Date(todo.due_date)
      const offset = localDate.getTimezoneOffset() * 60000
      const localISOTime = new Date(localDate.getTime() - offset).toISOString().slice(0, 16)
      setDueDate(localISOTime)
    }
    setIsEditing(false)
  }

  if (!isOpen || !todo) return null

  const todoOriginalDueDate = parseISO(todo.due_date)
  const isOverdue = !todo.completed && new Date() > todoOriginalDueDate

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                {isEditing ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                  {isEditing ? 'Edit Task' : 'Task Details'}
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">
                  {isEditing ? 'Update your task information' : 'View and manage task details'}
                </p>
              </div>
            </div>
            <button 
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white flex-shrink-0"
              onClick={onClose}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[65vh] sm:max-h-[60vh] overflow-y-auto">
          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Task Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  placeholder="Enter task title"
                  required
                />
              ) : (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl border border-gray-200">
                  <p className={`text-base sm:text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {todo.title}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Description
              </label>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white resize-none text-sm sm:text-base"
                  placeholder="Enter task description (optional)"
                  rows={4}
                />
              ) : (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200 min-h-[60px] sm:min-h-[80px] flex items-center">
                  <p className={`text-sm sm:text-base text-gray-700 leading-relaxed ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.description || 'No description provided'}
                  </p>
                </div>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Due Date & Time
              </label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                />
              ) : (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl border border-yellow-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-800">
                          {format(todoOriginalDueDate, 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          at {format(todoOriginalDueDate, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    {isOverdue && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 self-start">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mr-1.5 sm:mr-2"></div>
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isEditing && (
              <>
                {/* Status */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Current Status
                  </label>
                  <div className={`p-4 rounded-xl border ${
                    todo.completed 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                      : isOverdue 
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
                        : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        todo.completed 
                          ? 'bg-green-500' 
                          : isOverdue 
                            ? 'bg-red-500' 
                            : 'bg-yellow-500'
                      }`}></div>
                      <span className={`font-semibold ${
                        todo.completed 
                          ? 'text-green-700' 
                          : isOverdue 
                            ? 'text-red-700' 
                            : 'text-yellow-700'
                      }`}>
                        {todo.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Created
                    </label>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-sm font-medium text-purple-700">
                          {format(parseISO(todo.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-xs text-purple-600 ml-6">
                        {format(parseISO(todo.created_at), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Last Updated
                    </label>
                    <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <p className="text-sm font-medium text-cyan-700">
                          {format(parseISO(todo.updated_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-xs text-cyan-600 ml-6">
                        {format(parseISO(todo.updated_at), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50/50 backdrop-blur-lg p-4 sm:p-6 border-t border-gray-200/50">
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-3">
            {isEditing ? (
              <>
                <button 
                  className="order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="order-1 sm:order-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm sm:text-base" 
                  onClick={handleSave}
                  disabled={loading || !title.trim()}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden sm:inline">Save Changes</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button 
                  className="order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base" 
                  onClick={onClose}
                >
                  Close
                </button>
                <button 
                  className="order-1 sm:order-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2 text-sm sm:text-base" 
                  onClick={() => setIsEditing(true)}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Edit Task</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}