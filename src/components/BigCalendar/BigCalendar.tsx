'use client'

import { useState, useEffect } from 'react'
import { Todo } from '@/lib/supabase'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, parseISO, isAfter, startOfWeek, endOfWeek } from 'date-fns'

interface BigCalendarProps {
  todos: Todo[]
  onEditTodo: (todo: Todo) => void
  onToggleComplete: (todo: Todo) => void
}

export default function BigCalendar({ todos, onEditTodo, onToggleComplete }: BigCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [screenWidth, setScreenWidth] = useState(1024) // Default to large screen

  // Update screen width on resize
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth)
    }

    // Set initial width
    updateScreenWidth()

    // Add event listener
    window.addEventListener('resize', updateScreenWidth)

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenWidth)
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Get todos for a specific date
  const getTodosForDate = (date: Date) => {
    return todos.filter(todo => {
      const todoDate = parseISO(todo.due_date)
      return isSameDay(todoDate, date)
    })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm hidden sm:block">
                Tasks Calendar View
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 text-white"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 sm:p-4 lg:p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div key={day} className="text-center py-2 sm:py-3 bg-gray-100 rounded-md sm:rounded-lg">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                <span className="hidden lg:inline">{day}</span>
                <span className="hidden sm:inline lg:hidden">{day.substring(0, 3)}</span>
                <span className="sm:hidden">{day.substring(0, 1)}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map(day => {
            const dayTodos = getTodosForDate(day)
            const isTodayDate = isToday(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-20 sm:min-h-28 md:min-h-32 lg:min-h-40 p-1 sm:p-2 lg:p-3 rounded-md sm:rounded-lg border transition-all duration-200 ${
                  isTodayDate
                    ? 'bg-blue-50 border-blue-300 border-2'
                    : isCurrentMonth
                      ? 'bg-white border-gray-200 hover:border-gray-300'
                      : 'bg-gray-50 border-gray-100'
                }`}
              >
                {/* Date number */}
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className={`text-xs sm:text-sm lg:text-base font-semibold ${
                    isTodayDate 
                      ? 'text-blue-700' 
                      : isCurrentMonth 
                        ? 'text-gray-800' 
                        : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayTodos.length > 0 && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-1 sm:px-1.5 py-0.5 rounded-full hidden sm:inline">
                      {dayTodos.length}
                    </span>
                  )}
                </div>

                {/* Tasks for this day */}
                <div className="space-y-0.5 sm:space-y-1">
                  {dayTodos.slice(0, screenWidth < 640 ? 1 : screenWidth < 768 ? 2 : screenWidth < 1024 ? 3 : 4).map((todo, index) => {
                    const isOverdue = !todo.completed && isAfter(new Date(), parseISO(todo.due_date))
                    const maxTitleLength = screenWidth < 640 ? 6 : screenWidth < 768 ? 8 : screenWidth < 1024 ? 10 : 15
                    
                    return (
                      <div
                        key={todo.id}
                        className={`group relative p-0.5 sm:p-1 lg:p-1.5 rounded-sm sm:rounded-md text-xs cursor-pointer transition-all duration-200 hover:scale-105 ${
                          todo.completed
                            ? 'bg-green-100 border border-green-200 text-green-800'
                            : isOverdue
                              ? 'bg-red-100 border border-red-200 text-red-800'
                              : 'bg-yellow-100 border border-yellow-200 text-yellow-800'
                        }`}
                        onClick={() => onEditTodo(todo)}
                      >
                        {/* Task content */}
                        <div className="flex items-center gap-1 min-w-0">
                          {/* Checkbox */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onToggleComplete(todo)
                            }}
                            className={`flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border transition-all duration-200 hover:scale-110 ${
                              todo.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400 hover:border-gray-600'
                            }`}
                          >
                            {todo.completed && (
                              <svg className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          
                          {/* Task title */}
                          <span className={`flex-1 leading-none text-xs sm:text-xs lg:text-xs truncate min-w-0 overflow-hidden ${
                            todo.completed ? 'line-through opacity-75' : ''
                          }`} style={{ fontSize: screenWidth < 640 ? '10px' : '12px' }}>
                            {truncateText(todo.title, maxTitleLength)}
                          </span>
                        </div>

                        {/* Time - only show on larger screens */}
                        <div className="mt-0.5 sm:mt-1 text-xs opacity-75 hidden sm:block">
                          {format(parseISO(todo.due_date), 'h:mm a')}
                        </div>

                        {/* Hover actions */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-sm sm:rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Show more indicator */}
                  {dayTodos.length > (screenWidth < 640 ? 1 : screenWidth < 768 ? 2 : screenWidth < 1024 ? 3 : 4) && (
                    <div className="text-xs text-gray-500 text-center py-0.5 sm:py-1 bg-gray-100 rounded-sm sm:rounded-md">
                      +{dayTodos.length - (screenWidth < 640 ? 1 : screenWidth < 768 ? 2 : screenWidth < 1024 ? 3 : 4)} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-gray-600">Overdue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-gray-600">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded"></div>
              <span className="text-gray-600">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}