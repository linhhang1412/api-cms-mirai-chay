-- Migration to add indexes for better query performance
-- This migration adds additional indexes that might be helpful for user queries

-- Create index on email and status for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_email_status ON "users"("email", "status");

-- Create index on role for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_user_role ON "users"("role");

-- Create index on createdAt for sorting
CREATE INDEX IF NOT EXISTS idx_user_created_at ON "users"("createdAt");

-- Create index on updatedAt for sorting
CREATE INDEX IF NOT EXISTS idx_user_updated_at ON "users"("updatedAt");

-- Create index on lastLoginAt for login-related queries
CREATE INDEX IF NOT EXISTS idx_user_last_login_at ON "users"("lastLoginAt");

-- Create index on publicId for faster lookups by public ID
CREATE INDEX IF NOT EXISTS idx_user_public_id ON "users"("publicId");