
-- Step 1: Add super_admin to the existing app_role enum
ALTER TYPE public.app_role ADD VALUE 'super_admin';
