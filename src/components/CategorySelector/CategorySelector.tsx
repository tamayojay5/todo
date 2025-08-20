'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

interface CategorySelectorProps {
  value?: string
  onChange: (categoryId: string | null) => void
  className?: string
}

// Mock categories - will be replaced with API call
const mockCategories: Category[] = [
  { id: '1', name: 'Personal', color: '#10b981', icon: '🏠' },
  { id: '2', name: 'Work', color: '#3b82f6', icon: '💼' },
  { id: '3', name: 'Health', color: '#ef4444', icon: '❤️' },
  { id: '4', name: 'Learning', color: '#8b5cf6', icon: '📚' },
  { id: '5', name: 'Shopping', color: '#f59e0b', icon: '🛒' }
]

export default function CategorySelector({ value, onChange, className = '' }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  
  const selectedCategory = categories.find(c => c.id === value)

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {selectedCategory ? (
          <>
            <span className="mr-1">{selectedCategory.icon}</span>
            {selectedCategory.name}
          </>
        ) : (
          <>
            <span className="mr-1">📁</span>
            Category
          </>
        )}
        <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 flex items-center transition-colors"
            >
              <span className="mr-2">❌</span>
              No Category
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  onChange(category.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 flex items-center transition-colors ${
                  value === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                <span className="flex-1">{category.name}</span>
                <div 
                  className="w-3 h-3 rounded-full ml-2" 
                  style={{ backgroundColor: category.color }}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}