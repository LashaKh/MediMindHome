/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, matches auth.users)
      - email (text)
      - created_at (timestamp)
    
    - conversations
      - id (uuid)
      - title (text)
      - created_at (timestamp)
      - updated_at (timestamp)
      - status (text)
    
    - conversation_participants
      - conversation_id (uuid)
      - user_id (uuid)
    
    - messages
      - id (uuid)
      - conversation_id (uuid)
      - content (text)
      - type (text)
      - created_at (timestamp)
      - status (text)
      - metadata (jsonb)
    
    - notes
      - id (uuid)
      - user_id (uuid)
      - title (text)
      - content (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - patients
      - id (uuid)
      - user_id (uuid)
      - name (text)
      - diagnosis (text)
      - room_number (text)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)
      - admission_date (timestamp)
      - echo_data (jsonb)
      - ecg_data (jsonb)
    
    - patient_notes
      - id (uuid)
      - patient_id (uuid)
      - content (text)
      - type (text)
      - created_at (timestamp)
      - created_by (uuid)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (mirrors auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Conversations table
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL DEFAULT 'New Conversation',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived'))
);

-- Conversation participants
CREATE TABLE conversation_participants (
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('user', 'ai')),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'error')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Notes table
CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Note',
  content text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table
CREATE TABLE patients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  diagnosis text,
  room_number text,
  status text DEFAULT 'stable' CHECK (status IN ('stable', 'critical', 'monitoring')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  admission_date timestamptz DEFAULT now(),
  echo_data jsonb DEFAULT '{}'::jsonb,
  ecg_data jsonb DEFAULT '{}'::jsonb
);

-- Patient notes table
CREATE TABLE patient_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_notes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Conversations policies
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = id
      AND user_id = auth.uid()
    )
  );

-- Conversation participants policies
CREATE POLICY "Users can add participants" ON conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view participants" ON conversation_participants
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view conversation messages" ON messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

-- Notes policies
CREATE POLICY "Users can manage their notes" ON notes
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Patients policies
CREATE POLICY "Users can manage their patients" ON patients
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Patient notes policies
CREATE POLICY "Users can manage patient notes" ON patient_notes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE id = patient_notes.patient_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE id = patient_notes.patient_id
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patient_notes_patient_id ON patient_notes(patient_id);