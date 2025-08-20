'use client'

import { useState } from 'react'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: FilterOptions) => void
  className?: string
}

interface FilterOptions {
  priority: string[]
  categories: string[]
  tags: string[]
  completed: boolean | null
  dateRange: { from: Date | null; to: Date | null }
}

const priorityOptions = [
  { value: 'high', label: 'High Priority', color: 'text-red-600' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
  { value: 'low', label: 'Low Priority', color: 'text-green-600' }
]

const categoryOptions = [
  { value: 'personal', label: 'Personal', icon: '🏠' },
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'health', label: 'Health', icon: '❤️' },
  { value: 'learning', label: 'Learning', icon: '📚' }
]

export default function SearchFilter({ onSearch, onFilter, className = '' }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    priority: [],
    categories: [],
    tags: [],
    completed: null,
    dateRange: { from: null, to: null }
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const toggleFilter = (type: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters }
    const filterArray = newFilters[type] as string[]
    
    if (filterArray.includes(value)) {
      newFilters[type] = filterArray.filter(item => item !== value) as any
    } else {
      newFilters[type] = [...filterArray, value] as any
    }
    
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const setCompletedFilter = (completed: boolean | null) => {
    const newFilters = { ...filters, completed }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      priority: [],
      categories: [],
      tags: [],
      completed: null,
      dateRange: { from: null, to: null }
    }
    setFilters(clearedFilters)
    onFilter(clearedFilters)
    setSearchQuery('')
    onSearch('')
  }

  const activeFilterCount = filters.priority.length + filters.categories.length + filters.tags.length + (filters.completed !== null ? 1 : 0)

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search todos..."
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => setCompletedFilter(null)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.completed === null
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCompletedFilter(false)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.completed === false
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setCompletedFilter(true)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.completed === true
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFilter('priority', option.value)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.priority.includes(option.value)
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFilter('categories', option.value)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors flex items-center ${
                    filters.categories.includes(option.value)
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}