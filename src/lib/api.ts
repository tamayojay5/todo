import { Todo } from './supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_GOLANG_BACKEND_URL || 'http://localhost:8080'

export class ApiClient {
  private getHeaders(userId: string) {
    return {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
    }
  }

  async getTodos(userId: string): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        headers: this.getHeaders(userId),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching todos:', error)
      return []
    }
  }

  async createTodo(userId: string, todo: {
    title: string
    description?: string
    due_date: string
  }): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/api/todos`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify(todo),
    })

    if (!response.ok) {
      throw new Error('Failed to create todo')
    }

    return response.json()
  }

  async updateTodo(userId: string, todoId: string, updates: {
    title?: string
    description?: string
    due_date?: string
    completed?: boolean
  }): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
      method: 'PUT',
      headers: this.getHeaders(userId),
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error('Failed to update todo')
    }

    return response.json()
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
      method: 'DELETE',
      headers: this.getHeaders(userId),
    })

    if (!response.ok) {
      throw new Error('Failed to delete todo')
    }
  }
}

export const apiClient = new ApiClient()