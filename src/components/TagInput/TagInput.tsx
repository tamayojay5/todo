'use client'

import { useState, useRef, useEffect } from 'react'

interface Tag {
  id: string
  name: string
  color: string
}

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  className?: string
}

// Mock available tags - will be replaced with API call
const availableTags: Tag[] = [
  { id: '1', name: 'urgent', color: '#ef4444' },
  { id: '2', name: 'important', color: '#f59e0b' },
  { id: '3', name: 'meeting', color: '#8b5cf6' },
  { id: '4', name: 'creative', color: '#06b6d4' },
  { id: '5', name: 'research', color: '#10b981' },
  { id: '6', name: 'review', color: '#6366f1' }
]

export default function TagInput({ tags, onChange, className = '' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredTags, setFilteredTags] = useState(availableTags)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const filtered = availableTags.filter(tag => 
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(tag.name)
    )
    setFilteredTags(filtered)
  }, [inputValue, tags])

  const addTag = (tagName: string) => {
    if (!tags.includes(tagName) && tagName.trim()) {
      onChange([...tags, tagName.trim()])
      setInputValue('')
      setIsOpen(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const getTagColor = (tagName: string) => {
    const tag = availableTags.find(t => t.name === tagName)
    return tag?.color || '#6b7280'
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-200 rounded-lg bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-colors">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white"
            style={{ backgroundColor: getTagColor(tag) }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-1 min-w-20 bg-transparent outline-none text-sm placeholder-gray-400"
        />
      </div>

      {isOpen && (inputValue || filteredTags.length > 0) && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-32 overflow-y-auto">
            {inputValue && !availableTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase()) && (
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
              >
                <span className="mr-2">+</span>
                Create "{inputValue}"
              </button>
            )}
            {filteredTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTag(tag.name)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}