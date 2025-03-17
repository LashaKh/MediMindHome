@@ .. @@
 -- Create secure notes table
 CREATE TABLE secure_notes (
   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id uuid REFERENCES users(id) ON DELETE CASCADE,
+  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
   content text NOT NULL,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
@@ .. @@
 -- Create indexes
 CREATE INDEX idx_secure_notes_user_id ON secure_notes(user_id);
+CREATE INDEX idx_secure_notes_patient_id ON secure_notes(patient_id);
 CREATE INDEX idx_secure_notes_created_at ON secure_notes(created_at);