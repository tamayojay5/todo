import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Todo = {
  id: string
  title: string
  description?: string
  due_date: string
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}