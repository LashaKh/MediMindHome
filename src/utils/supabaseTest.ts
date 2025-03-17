import { supabase } from '../lib/supabase';

/**
 * This file contains utility functions to test Supabase connectivity
 * and table structure. You can use these functions in your browser console
 * to help debug Supabase issues.
 * 
 * Example usage in browser console:
 * import('/src/utils/supabaseTest.ts').then(mod => mod.testSupabaseConnection())
 */

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('medivoice_results').select('*').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection successful!', data);
    return { success: true, data };
  } catch (e) {
    console.error('Unexpected error testing Supabase:', e);
    return { success: false, error: e };
  }
}

export async function testMediaVoiceInsert() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }

    const testData = {
      user_id: session.user.id,
      job_name: 'test-job-' + Date.now(),
      file_name: 'test-file.mp3',
      transcript: { 
        results: { 
          transcripts: [{ 
            transcript: 'This is a test transcript for debugging purposes.' 
          }] 
        } 
      },
      clinical_summary: { 
        summary: 'This is a test clinical summary.' 
      }
    };
    
    console.log('Attempting to insert test data:', testData);
    
    const { data, error } = await supabase
      .from('medivoice_results')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('Test insert failed:', error);
      return { success: false, error };
    }
    
    console.log('Test insert successful!', data);
    return { success: true, data };
  } catch (e) {
    console.error('Unexpected error during test insert:', e);
    return { success: false, error: e };
  }
}

export async function getMediaVoiceSchema() {
  try {
    // This isn't a direct way to get schema in Supabase JS client,
    // so we'll infer it from a row if possible
    const { data, error } = await supabase
      .from('medivoice_results')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Failed to get schema:', error);
      return { success: false, error };
    }
    
    if (!data || data.length === 0) {
      console.log('No rows found to infer schema. Returning expected schema...');
      return { 
        success: true, 
        schema: {
          id: 'UUID PRIMARY KEY',
          user_id: 'UUID NOT NULL REFERENCES auth.users(id)',
          job_name: 'TEXT NOT NULL',
          file_name: 'TEXT NOT NULL',
          transcript: 'JSONB NOT NULL',
          clinical_summary: 'JSONB',
          media_url: 'TEXT',
          created_at: 'TIMESTAMPTZ NOT NULL DEFAULT now()',
          updated_at: 'TIMESTAMPTZ NOT NULL DEFAULT now()'
        }
      };
    }
    
    // Create schema based on the data types
    const schema: Record<string, string> = {};
    const row = data[0];
    
    for (const [key, value] of Object.entries(row)) {
      schema[key] = typeof value;
    }
    
    console.log('Inferred schema:', schema);
    return { success: true, schema };
  } catch (e) {
    console.error('Unexpected error getting schema:', e);
    return { success: false, error: e };
  }
}

export async function insertRealisticTranscription() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }

    // Create a realistic format similar to what we see in the example screenshot
    const testData = {
      user_id: session.user.id,
      job_name: 'sample-job-' + Date.now(),
      file_name: 'patient-consultation.mp3',
      transcript: {
        results: {
          transcripts: [
            {
              transcript: "Doctor: Hi, good morning Mickey. Um, my name is Kate Moore. I'm going to be helping you, uh, get this paperwork checked out and try and get you, uh, all taken care of here and get your questions answered. So, um, tell me, uh, what brings you in today? Patient: Um, I have, uh, been feeling, um, quite tired and, um, I just feel like my, um, um, BP is just always racing."
            }
          ],
          items: [
            {
              start_time: "0.0",
              end_time: "2.46",
              alternatives: [{ confidence: "1.0", content: "Doctor:" }],
              type: "pronunciation"
            },
            {
              start_time: "2.46", 
              end_time: "2.67",
              alternatives: [{ confidence: "0.9989", content: "Hi," }],
              type: "pronunciation"
            },
            // More items would be here in a real transcript
          ],
          language_code: "en-US",
          language_identification: [{ score: "0.9999", language_code: "en-US" }]
        }
      },
      clinical_summary: {
        summary: "Patient presents with fatigue and high blood pressure. They report a history of asthma related to being overweight in the past. They have a family history of high blood pressure and diabetes from their grandmother.",
        key_points: [
          "Fatigue and high blood pressure.",
          "History of asthma related to being overweight.",
          "Family history of high blood pressure and diabetes."
        ]
      },
      media_url: "s3://medivoice-recordings/sample-recording-" + Date.now() + ".mp3"
    };
    
    console.log('Attempting to insert realistic test data:', testData);
    
    const { data, error } = await supabase
      .from('medivoice_results')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('Test insert failed:', error);
      return { success: false, error };
    }
    
    console.log('Realistic test insert successful!', data);
    return { success: true, data };
  } catch (e) {
    console.error('Unexpected error during test insert:', e);
    return { success: false, error: e };
  }
}

export async function insertSimpleSummaryTest() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }

    // Create a very simple format with just a summary string
    const testData = {
      user_id: session.user.id,
      job_name: 'simple-test-' + Date.now(),
      file_name: 'simple-patient-case.mp3',
      transcript: { 
        results: { 
          transcripts: [{ 
            transcript: 'Doctor: What brings you in today? Patient: I have been experiencing severe headaches for the past week.' 
          }] 
        } 
      },
      clinical_summary: { 
        summary: "Patient presents with severe headaches lasting for one week.",
        key_points: [
          "Severe headaches",
          "Duration: one week",
          "No prior history mentioned"
        ]
      }
    };
    
    console.log('Attempting to insert simple test data:', testData);
    
    const { data, error } = await supabase
      .from('medivoice_results')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('Simple test insert failed:', error);
      return { success: false, error };
    }
    
    console.log('Simple test insert successful!', data);
    return { success: true, data };
  } catch (e) {
    console.error('Unexpected error during simple test insert:', e);
    return { success: false, error: e };
  }
} 