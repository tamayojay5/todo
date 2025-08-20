'use client'

import { useState } from 'react'

interface PrioritySelectorProps {
  value: 'low' | 'medium' | 'high'
  onChange: (priority: 'low' | 'medium' | 'high') => void
  className?: string
}

const priorities = [
  { value: 'low' as const, label: 'Low', color: 'bg-green-100 text-green-800 border-green-200', icon: '📋' },
  { value: 'medium' as const, label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⚡' },
  { value: 'high' as const, label: 'High', color: 'bg-red-100 text-red-800 border-red-200', icon: '🔥' }
]

export default function PrioritySelector({ value, onChange, className = '' }: PrioritySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedPriority = priorities.find(p => p.value === value) || priorities[1]

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${selectedPriority.color} hover:opacity-80`}
      >
        <span className="mr-1">{selectedPriority.icon}</span>
        {selectedPriority.label}
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
          <div className="absolute z-20 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => {
                  onChange(priority.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 flex items-center transition-colors ${
                  value === priority.value ? priority.color.replace('bg-', 'bg-opacity-20 bg-') : 'text-gray-700'
                }`}
              >
                <span className="mr-2">{priority.icon}</span>
                {priority.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export { priorities }