-- Add patient_id column to abg_results table
ALTER TABLE "public"."abg_results" 
ADD COLUMN "patient_id" UUID REFERENCES "public"."patients"("id");

-- Update RLS policies to allow access to the patient_id field
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON "public"."abg_results";
CREATE POLICY "Enable select for users based on user_id" ON "public"."abg_results"
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON "public"."abg_results";
CREATE POLICY "Enable insert for users based on user_id" ON "public"."abg_results"
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable update for users based on user_id" ON "public"."abg_results";
CREATE POLICY "Enable update for users based on user_id" ON "public"."abg_results"
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."abg_results";
CREATE POLICY "Enable delete for users based on user_id" ON "public"."abg_results"
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Create index on patient_id for performance
CREATE INDEX IF NOT EXISTS "abg_results_patient_id_idx" ON "public"."abg_results" ("patient_id");

-- Add comment to describe column purpose
COMMENT ON COLUMN "public"."abg_results"."patient_id" IS 'Reference to the patient this result is associated with'; 