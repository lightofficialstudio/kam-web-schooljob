-- Add new columns to profiles table
ALTER TABLE "profiles" 
ADD COLUMN IF NOT EXISTS "first_name" TEXT,
ADD COLUMN IF NOT EXISTS "last_name" TEXT,
ADD COLUMN IF NOT EXISTS "phone_number" TEXT,
ADD COLUMN IF NOT EXISTS "specialization" TEXT,
ADD COLUMN IF NOT EXISTS "resume_url" TEXT;

-- Drop old fullName column if exists and replace with first_name and last_name
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "full_name";
