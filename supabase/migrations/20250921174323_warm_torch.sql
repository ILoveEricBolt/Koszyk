/*
  # Add folders and update shopping items status

  1. New Tables
    - `folders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to existing tables
    - `shopping_items`
      - Add `folder_id` (uuid, foreign key to folders, nullable)
      - Change `completed` (boolean) to `status` (text with check constraint)

  3. Security
    - Enable RLS on `folders` table
    - Add policies for authenticated users to manage their own folders
    - Update existing policies for shopping_items
*/

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on folders
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Create policies for folders
CREATE POLICY "Users can manage their own folders"
  ON folders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add folder_id to shopping_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shopping_items' AND column_name = 'folder_id'
  ) THEN
    ALTER TABLE shopping_items ADD COLUMN folder_id uuid REFERENCES folders(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add status column and migrate data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shopping_items' AND column_name = 'status'
  ) THEN
    ALTER TABLE shopping_items ADD COLUMN status text DEFAULT 'pending';
    
    -- Migrate existing data
    UPDATE shopping_items SET status = CASE 
      WHEN completed = true THEN 'completed'
      ELSE 'pending'
    END;
    
    -- Add constraint
    ALTER TABLE shopping_items ADD CONSTRAINT shopping_items_status_check 
      CHECK (status IN ('pending', 'completed', 'cancelled'));
  END IF;
END $$;

-- Remove old completed column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shopping_items' AND column_name = 'completed'
  ) THEN
    ALTER TABLE shopping_items DROP COLUMN completed;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS folders_user_id_idx ON folders(user_id);
CREATE INDEX IF NOT EXISTS shopping_items_folder_id_idx ON shopping_items(folder_id);
CREATE INDEX IF NOT EXISTS shopping_items_status_idx ON shopping_items(status);