'use client';

import { useState } from 'react';
import { Todo } from '@/lib/supabase';
import PrioritySelector from '../PrioritySelector/PrioritySelector';
import CategorySelector from '../CategorySelector/CategorySelector';
import TagInput from '../TagInput/TagInput';

interface TodoFormProps {
  onSubmit: (todo: {
    title: string;
    description?: string;
    due_date: string;
    priority?: 'low' | 'medium' | 'high';
    category_id?: string | null;
    tags?: string[];
    estimated_time?: number | null;
    is_recurring?: boolean;
  }) => Promise<void>;
  editingTodo?: Todo;
  onCancel?: () => void;
}

export default function TodoForm({
  onSubmit,
  editingTodo,
  onCancel,
}: TodoFormProps) {
  const [title, setTitle] = useState(editingTodo?.title || '');
  const [description, setDescription] = useState(
    editingTodo?.description || ''
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    (editingTodo?.priority as 'low' | 'medium' | 'high') || 'medium'
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    editingTodo?.category_id || null
  );
  const [tags, setTags] = useState<string[]>(
    editingTodo?.tags || []
  );
  const [estimatedTime, setEstimatedTime] = useState<number | null>(
    editingTodo?.estimated_time || null
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [dueDate, setDueDate] = useState(() => {
    if (editingTodo?.due_date) {
      // Convert UTC to local time for datetime-local input
      const localDate = new Date(editingTodo.due_date);
      const offset = localDate.getTimezoneOffset() * 60000;
      return new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
    }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [dueDateError, setDueDateError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTitleError('');
    setDueDateError('');

    let hasErrors = false;

    if (!title.trim()) {
      setTitleError('Task title is required');
      hasErrors = true;
    }

    if (!dueDate) {
      setDueDateError('Due date is required');
      hasErrors = true;
    } else {
      const selectedDate = new Date(dueDate);
      const now = new Date();
      if (selectedDate < now) {
        setDueDateError('Due date cannot be in the past');
        hasErrors = true;
      }
    }

    if (hasErrors) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: new Date(dueDate).toISOString(),
        priority,
        category_id: categoryId,
        tags,
        estimated_time: estimatedTime,
        is_recurring: isRecurring,
      });

      if (!editingTodo) {
        setTitle('');
        setDescription('');
        setDueDate('');
      }
    } catch (error) {
      console.error('Failed to save todo:', error);
      setTitleError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
            {editingTodo ? (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {editingTodo ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">
              {editingTodo
                ? 'Update your task details'
                : 'Add a new task to your list'}
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
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-sm sm:text-base ${
                titleError
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
            />
            {titleError && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">
                {titleError}
              </p>
            )}
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

          {/* Priority, Category, and Tags Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <PrioritySelector
                value={priority}
                onChange={setPriority}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <CategorySelector
                value={categoryId || undefined}
                onChange={setCategoryId}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Estimated Time (min)
              </label>
              <input
                type="number"
                placeholder="30"
                className="w-full px-3 sm:px-4 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-sm"
                value={estimatedTime || ''}
                onChange={(e) => setEstimatedTime(e.target.value ? parseInt(e.target.value) : null)}
                min="1"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <TagInput
              tags={tags}
              onChange={setTags}
            />
          </div>

          {/* Recurring Task Option */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
              Make this a recurring task
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base ${
                dueDateError
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (dueDateError) setDueDateError('');
              }}
            />
            {dueDateError && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">
                {dueDateError}
              </p>
            )}
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
              className={`${
                onCancel ? 'flex-1' : 'w-full'
              } px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm sm:text-base`}
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
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                  <span className="hidden sm:inline">
                    {editingTodo ? 'Update Task' : 'Create Task'}
                  </span>
                  <span className="sm:hidden">
                    {editingTodo ? 'Update' : 'Create'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
