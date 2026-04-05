-- Migration: Add `email` column to the `users` table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
