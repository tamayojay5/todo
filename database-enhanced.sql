-- Enhanced database schema with all new features

-- Add priority, category, and other new columns to todos table
ALTER TABLE todos ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
ALTER TABLE todos ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);
ALTER TABLE todos ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES todos(id);
ALTER TABLE todos ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE todos ADD COLUMN IF NOT EXISTS recurrence_pattern JSONB;
ALTER TABLE todos ADD COLUMN IF NOT EXISTS estimated_time INTEGER; -- in minutes
ALTER TABLE todos ADD COLUMN IF NOT EXISTS actual_time INTEGER; -- in minutes
ALTER TABLE todos ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

-- Categories/Projects table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1', -- hex color
    icon VARCHAR(50),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, user_id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#10b981',
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, user_id)
);

-- Todo-Tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS todo_tags (
    todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (todo_id, tag_id)
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    template_data JSONB NOT NULL, -- stores the template structure
    is_public BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time tracking table
CREATE TABLE IF NOT EXISTS time_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in seconds
    session_type VARCHAR(20) DEFAULT 'work' CHECK (session_type IN ('work', 'break', 'pomodoro')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log for progress tracking
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'created', 'completed', 'updated', etc.
    entity_type VARCHAR(20) NOT NULL, -- 'todo', 'category', 'tag'
    entity_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_category_id ON todos(category_id);
CREATE INDEX IF NOT EXISTS idx_todos_parent_id ON todos(parent_id);
CREATE INDEX IF NOT EXISTS idx_todos_user_id_completed ON todos(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id, created_at);

-- Insert default categories
INSERT INTO categories (name, color, icon, user_id) 
SELECT 'Personal', '#10b981', '🏠', id FROM auth.users 
ON CONFLICT (name, user_id) DO NOTHING;

INSERT INTO categories (name, color, icon, user_id) 
SELECT 'Work', '#3b82f6', '💼', id FROM auth.users 
ON CONFLICT (name, user_id) DO NOTHING;

INSERT INTO categories (name, color, icon, user_id) 
SELECT 'Health', '#ef4444', '❤️', id FROM auth.users 
ON CONFLICT (name, user_id) DO NOTHING;