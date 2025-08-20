'use client'

import { useState, useEffect } from 'react'
import { Todo } from '@/lib/supabase'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import TodoItem from '../TodoItem/TodoItem'
import TodoForm from '../TodoForm/TodoForm'
import DueDateModal from '../DueDateModal/DueDateModal'
import TodoDetailsModal from '../TodoDetailsModal/TodoDetailsModal'
import BigCalendar from '../BigCalendar/BigCalendar'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import KanbanView from '../KanbanView/KanbanView'
import SearchFilter from '../SearchFilter/SearchFilter'
import { isAfter, parseISO, isSameDay } from 'date-fns'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [showDueDateModal, setShowDueDateModal] = useState(false)
  const [dueTodos, setDueTodos] = useState<Todo[]>([])
  const [notifiedTodos, setNotifiedTodos] = useState<Set<string>>(new Set())
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [detailsTodo, setDetailsTodo] = useState<Todo | null>(null)
  const [currentView, setCurrentView] = useState<'list' | 'board' | 'calendar'>('list')
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Helper function to save notified todos to localStorage
  const saveNotifiedTodos = (notifiedSet: Set<string>) => {
    if (user) {
      const notifiedArray = Array.from(notifiedSet)
      localStorage.setItem(`notified_todos_${user.id}`, JSON.stringify(notifiedArray))
    }
  }

  // Load notified todos from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`notified_todos_${user.id}`)
      if (stored) {
        try {
          const notifiedIds = JSON.parse(stored)
          setNotifiedTodos(new Set(notifiedIds))
        } catch (error) {
          console.log('Failed to parse stored notifications:', error)
        }
      }
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadTodos()
    }
  }, [user])

  // Update filtered todos when todos or search changes
  useEffect(() => {
    let filtered = todos
    
    if (searchQuery.trim()) {
      filtered = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    setFilteredTodos(filtered)
  }, [todos, searchQuery])

  useEffect(() => {
    const checkDueDates = () => {
      if (!todos || !Array.isArray(todos)) return
      
      const now = new Date()
      const overdueTodos = todos.filter(todo => 
        todo && !todo.completed && todo.due_date && 
        isAfter(now, parseISO(todo.due_date)) &&
        !notifiedTodos.has(todo.id) // Only show if not already notified
      )
      
      if (overdueTodos.length > 0) {
        setDueTodos(overdueTodos)
        setShowDueDateModal(true)
        
        // Mark these todos as notified
        const newNotifiedSet = new Set([...Array.from(notifiedTodos), ...overdueTodos.map(todo => todo.id)])
        setNotifiedTodos(newNotifiedSet)
        saveNotifiedTodos(newNotifiedSet)
      }
    }

    if (todos && Array.isArray(todos) && todos.length > 0) {
      checkDueDates()
      const interval = setInterval(checkDueDates, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [todos, notifiedTodos])

  const loadTodos = async () => {
    if (!user) return
    
    try {
      const fetchedTodos = await apiClient.getTodos(user.id)
      setTodos(Array.isArray(fetchedTodos) ? fetchedTodos : [])
    } catch (error) {
      console.error('Failed to load todos:', error)
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTodo = async (todoData: {
    title: string
    description?: string
    due_date: string
    priority?: 'low' | 'medium' | 'high'
    category_id?: string | null
    tags?: string[]
    estimated_time?: number | null
    is_recurring?: boolean
  }) => {
    if (!user) return

    try {
      const newTodo = await apiClient.createTodo(user.id, todoData)
      setTodos(prevTodos => Array.isArray(prevTodos) ? [...prevTodos, newTodo] : [newTodo])
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  const handleUpdateTodo = async (todoData: {
    title: string
    description?: string
    due_date: string
    priority?: 'low' | 'medium' | 'high'
    category_id?: string | null
    tags?: string[]
    estimated_time?: number | null
    is_recurring?: boolean
  }) => {
    if (!user || !editingTodo) return

    try {
      const updatedTodo = await apiClient.updateTodo(user.id, editingTodo.id, todoData)
      setTodos(prevTodos => 
        Array.isArray(prevTodos) 
          ? prevTodos.map(todo => todo.id === editingTodo.id ? updatedTodo : todo)
          : [updatedTodo]
      )
      
      // Clear notification tracking when due date is updated so it can be notified again
      const newNotifiedSet = new Set(notifiedTodos)
      newNotifiedSet.delete(editingTodo.id)
      setNotifiedTodos(newNotifiedSet)
      saveNotifiedTodos(newNotifiedSet)
      
      setEditingTodo(null)
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const handleToggleComplete = async (todo: Todo) => {
    if (!user) return

    try {
      const updatedTodo = await apiClient.updateTodo(user.id, todo.id, {
        completed: !todo.completed
      })
      setTodos(prevTodos => 
        Array.isArray(prevTodos) 
          ? prevTodos.map(t => t.id === todo.id ? updatedTodo : t)
          : [updatedTodo]
      )
      
      // If completing a todo, remove it from notified list so it can be notified again if it becomes overdue
      if (!todo.completed) {
        const newNotifiedSet = new Set(notifiedTodos)
        newNotifiedSet.delete(todo.id)
        setNotifiedTodos(newNotifiedSet)
        saveNotifiedTodos(newNotifiedSet)
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleDeleteTodo = async (todo: Todo) => {
    if (!user) return

    try {
      await apiClient.deleteTodo(user.id, todo.id)
      setTodos(prevTodos => 
        Array.isArray(prevTodos) 
          ? prevTodos.filter(t => t.id !== todo.id)
          : []
      )
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const handleUpdateTodoFromKanban = async (id: string, updates: Partial<Todo>) => {
    if (!user) return

    try {
      const updatedTodo = await apiClient.updateTodo(user.id, id, updates)
      setTodos(prevTodos => 
        Array.isArray(prevTodos) 
          ? prevTodos.map(t => t.id === id ? { ...t, ...updatedTodo } : t)
          : [updatedTodo]
      )
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const handleDeleteTodoFromKanban = async (id: string) => {
    if (!user) return

    try {
      await apiClient.deleteTodo(user.id, id)
      setTodos(prevTodos => 
        Array.isArray(prevTodos) 
          ? prevTodos.filter(t => t.id !== id)
          : []
      )
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = (filters: any) => {
    // TODO: Implement advanced filtering
    console.log('Filters applied:', filters)
  }

  const handleShowDetails = (todo: Todo) => {
    setDetailsTodo(todo)
    setShowDetailsModal(true)
  }

  const handleSaveFromDetails = async (todoData: {
    title: string
    description?: string
    due_date: string
  }) => {
    if (!user || !detailsTodo) return

    try {
      const updatedTodo = await apiClient.updateTodo(user.id, detailsTodo.id, todoData)
      setTodos(prevTodos => 
        Array.isArray(prevTodos) 
          ? prevTodos.map(todo => todo.id === detailsTodo.id ? updatedTodo : todo)
          : [updatedTodo]
      )
      
      // Clear notification tracking when due date is updated
      const newNotifiedSet = new Set(notifiedTodos)
      newNotifiedSet.delete(detailsTodo.id)
      setNotifiedTodos(newNotifiedSet)
      saveNotifiedTodos(newNotifiedSet)
      
      // Update the details todo with the new data
      setDetailsTodo(updatedTodo)
    } catch (error) {
      console.error('Failed to update todo:', error)
      throw error // Re-throw so the modal can handle the error
    }
  }

  const handleCloseDetails = () => {
    setShowDetailsModal(false)
    setDetailsTodo(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  My Tasks
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Stay organized, stay productive</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* View Switcher */}
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    currentView === 'list'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
                <button
                  onClick={() => setCurrentView('board')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    currentView === 'board'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Board
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    currentView === 'calendar'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendar
                </button>
              </div>
              
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-2 px-2 sm:px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">
                  {todos.filter(t => t.completed).length} completed
                </span>
              </div>
              
              <button 
                className="btn btn-ghost btn-sm gap-1 sm:gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 text-xs sm:text-sm"
                onClick={handleSignOut}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {(currentView === 'list' || currentView === 'board') && (
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <SearchFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            className="mb-6"
          />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {currentView === 'list' && (
          <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-5">
            {/* Create Form - Left Column */}
            <div className="lg:col-span-2 order-1">
              <div className="lg:sticky lg:top-24">
                <TodoForm
                  onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
                  editingTodo={editingTodo || undefined}
                  onCancel={editingTodo ? () => setEditingTodo(null) : undefined}
                />
              </div>
            </div>

          {/* Tasks List - Right Column */}
          <div className="lg:col-span-3 order-2">
            <div className="space-y-4 sm:space-y-6">
              {/* Tasks Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Your Tasks
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {todos.length === 0 
                      ? "No tasks yet" 
                      : `${todos.length} total • ${todos.filter(t => !t.completed).length} pending`
                    }
                  </p>
                </div>
                
                {todos.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(todos.filter(t => t.completed).length / todos.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                      {Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-4">
                {!todos || !Array.isArray(todos) || todos.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No tasks yet</h3>
                    <p className="text-gray-500 mb-6">Create your first task to get started with your productivity journey!</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 rounded-full">✨ Set due dates</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full">📝 Add descriptions</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full">✅ Track progress</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full">📅 Use calendar</span>
                    </div>
                  </div>
                ) : (
                  (filteredTodos.length > 0 ? filteredTodos : todos).map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleShowDetails}
                      onDelete={handleDeleteTodo}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Kanban Board View */}
        {currentView === 'board' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Task Board
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Drag tasks between columns to update their status
              </div>
            </div>
            <KanbanView
              todos={filteredTodos.length > 0 ? filteredTodos : todos}
              onUpdateTodo={handleUpdateTodoFromKanban}
              onDeleteTodo={handleDeleteTodoFromKanban}
            />
          </div>
        )}

        {/* Calendar View */}
        {currentView === 'calendar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Calendar View
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                View your tasks organized by date
              </div>
            </div>
            <BigCalendar
              todos={todos}
              onEditTodo={handleShowDetails}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        )}
      </div>

      <DueDateModal
        isOpen={showDueDateModal}
        todos={dueTodos}
        onClose={() => setShowDueDateModal(false)}
      />

      <TodoDetailsModal
        todo={detailsTodo}
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        onSave={handleSaveFromDetails}
      />
    </div>
  )
}