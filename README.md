# Todo App

A full-stack todo application with due date notifications built with:
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: Golang with Gorilla Mux
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Features

- ✅ User authentication (sign up, sign in, sign out)
- ✅ Create, read, update, delete todos
- ✅ Due date tracking with automatic notifications
- ✅ Real-time overdue task alerts
- ✅ Responsive design with DaisyUI components
- ✅ Clean, modern UI

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Run the SQL script in `database.sql` in the Supabase SQL editor

### 2. Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOLANG_BACKEND_URL=http://localhost:8080
```

#### Backend (.env)
```env
DATABASE_URL=your_supabase_database_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=8080
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Go dependencies
go mod tidy

# Run the server
go run main.go
```

## Usage

1. Open http://localhost:3000 in your browser
2. Sign up for a new account or sign in
3. Create todos with titles, descriptions, and due dates
4. Get automatic notifications when tasks become overdue
5. Mark tasks as completed or edit/delete them as needed

## Due Date Notifications

The app automatically checks for overdue tasks every minute and shows a modal notification when:
- A task's due date has passed
- The task is not marked as completed
- Example: If you set a due date for "21/07/2025 6:46 PM" and it's currently 6:47 PM, you'll see the notification

## API Endpoints

- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo

All endpoints require the `X-User-ID` header with the authenticated user's ID.