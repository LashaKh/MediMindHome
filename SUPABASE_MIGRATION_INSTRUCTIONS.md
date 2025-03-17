# Supabase Migration Instructions

This document contains instructions for manually applying the database changes to your Supabase project.

## Adding patient_id to the abg_results table

1. Navigate to your [Supabase dashboard](https://app.supabase.com)
2. Select your project: `khffoucpakkllhbzukvi`
3. Go to the "Table Editor" in the left sidebar
4. Select the "abg_results" table
5. Click on "Edit" in the top right corner

### 1. Add the patient_id column

1. In the table columns section, click "Add column"
2. Enter the following details:
   - Name: `patient_id`
   - Type: `uuid`
   - Default Value: Leave empty
   - Is Nullable: Check this box to allow NULL values
3. Click "Save" to add the column

### 2. Add a Foreign Key Relationship

1. In the "Foreign Key Relations" section, click "Add foreign key relation"
2. Configure the relationship:
   - Column: `patient_id`
   - Referenced Table: `patients`
   - Referenced Column: `id`
3. Click "Save" to create the relationship

### 3. Create an Index for Performance

1. Go to the "SQL Editor" in the left sidebar
2. Create a new query and enter the following SQL:

```sql
CREATE INDEX IF NOT EXISTS "abg_results_patient_id_idx" ON "public"."abg_results" ("patient_id");
```

3. Click "Run" to execute the query

## Verification

After applying these changes, you can verify that the migration was successful by:

1. Going back to the "Table Editor"
2. Selecting the "abg_results" table
3. Confirming that the `patient_id` column exists
4. In the "Foreign Key Relations" section, confirming the relationship to the `patients` table

## Note

The application has been updated to handle both the old and new schema. It will:
- Continue to work with the existing `patient` JSON field for backward compatibility
- Use the new `patient_id` field for more efficient querying and data integrity

No data migration is required for existing records, as they will continue to work with the application. 