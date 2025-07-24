'use client'

import { useState } from 'react'
import { Todo } from '@/lib/supabase'

interface TodoFormProps {
  onSubmit: (todo: {
    title: string
    description?: string
    due_date: string
  }) => Promise<void>
  editingTodo?: Todo
  onCancel?: () => void
}

export default function TodoForm({ onSubmit, editingTodo, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(editingTodo?.title || '')
  const [description, setDescription] = useState(editingTodo?.description || '')
  const [dueDate, setDueDate] = useState(() => {
    if (editingTodo?.due_date) {
      // Convert UTC to local time for datetime-local input
      const localDate = new Date(editingTodo.due_date)
      const offset = localDate.getTimezoneOffset() * 60000
      return new Date(localDate.getTime() - offset).toISOString().slice(0, 16)
    }
    return ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        title,
        description: description || undefined,
        due_date: new Date(dueDate).toISOString(),
      })
      
      if (!editingTodo) {
        setTitle('')
        setDescription('')
        setDueDate('')
      }
    } catch (error) {
      console.error('Failed to save todo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
            {editingTodo ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {editingTodo ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">
              {editingTodo ? 'Update your task details' : 'Add a new task to your list'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Task Title
            </label>
            <input
              type="text"
              placeholder="What needs to be done?"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-sm sm:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Add more details about this task (optional)"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 resize-none text-sm sm:text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
            {onCancel && (
              <button
                type="button"
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`${onCancel ? 'flex-1' : 'w-full'} px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm sm:text-base`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{editingTodo ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  {editingTodo ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">{editingTodo ? 'Update Task' : 'Create Task'}</span>
                  <span className="sm:hidden">{editingTodo ? 'Update' : 'Create'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}