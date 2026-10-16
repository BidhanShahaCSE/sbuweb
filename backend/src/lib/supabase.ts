import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_KEY?.trim();

/**
 * A null client lets the backend start even before local .env credentials
 * have been configured. The health endpoint reports the missing setup.
 */
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

/**
 * Check the Supabase REST API without reading or writing application data.
 * GET /rest/v1/ returns the API schema when the project URL and API key work.
 */
export async function verifySupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  if (!supabaseUrl || !supabaseKey) {
    return {
      connected: false,
      message: 'SUPABASE_URL or SUPABASE_KEY is missing',
    };
  }

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      return {
        connected: false,
        message: `Supabase REST API returned HTTP ${response.status}`,
      };
    }

    return {
      connected: true,
      message: 'Supabase connected successfully',
    };
  } catch (error) {
    return {
      connected: false,
      message:
        error instanceof Error ? error.message : 'Unknown connection error',
    };
  }
}
