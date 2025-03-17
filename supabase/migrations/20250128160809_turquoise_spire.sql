-- First add role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;

-- Create extension for password hashing if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create test doctors in auth.users if they don't exist
DO $$
DECLARE
  test_password text := crypt('password123', gen_salt('bf'));
  doctor_emails text[] := ARRAY['doctor1@example.com', 'doctor2@example.com', 'doctor3@example.com'];
  doctor_email text;
  doctor_id uuid;
BEGIN
  FOREACH doctor_email IN ARRAY doctor_emails
  LOOP
    -- Check if doctor already exists in auth.users
    SELECT id INTO doctor_id
    FROM auth.users
    WHERE email = doctor_email;

    IF doctor_id IS NULL THEN
      -- Create new doctor in auth.users
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        doctor_email,
        test_password,
        NOW(),
        NOW(),
        NOW(),
        encode(gen_random_bytes(32), 'hex'),
        encode(gen_random_bytes(32), 'hex')
      )
      RETURNING id INTO doctor_id;
    END IF;

    -- Ensure doctor exists in public.users with correct role
    INSERT INTO public.users (id, email, role, created_at)
    VALUES (doctor_id, doctor_email, 'doctor', NOW())
    ON CONFLICT (id) DO UPDATE
    SET role = 'doctor'
    WHERE users.id = doctor_id;
  END LOOP;
END $$;

-- Create index for role column if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Add assigned_doctor_id to patients if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'patients'
    AND column_name = 'assigned_doctor_id'
  ) THEN
    ALTER TABLE patients
    ADD COLUMN assigned_doctor_id uuid REFERENCES users(id);
  END IF;
END $$;

-- Create index for assigned_doctor_id
CREATE INDEX IF NOT EXISTS idx_patients_assigned_doctor ON patients(assigned_doctor_id);