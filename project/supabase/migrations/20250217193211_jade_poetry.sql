/*
  # Create articles table for storing analysis history

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `url` (text, nullable)
      - `content` (text)
      - `prediction` (text)
      - `confidence` (float)
      - `keywords` (text array)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `articles` table
    - Add policies for authenticated users to:
      - Read their own articles
      - Insert new articles
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text,
  content text NOT NULL,
  prediction text NOT NULL CHECK (prediction IN ('real', 'fake')),
  confidence float NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  keywords text[] NOT NULL DEFAULT '{}',
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);