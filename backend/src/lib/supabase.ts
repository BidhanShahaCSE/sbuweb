const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_KEY?.trim();

/**
 * Verify the Supabase REST API without reading or writing application data.
 * This keeps the setup lightweight and requires no extra npm dependency.
 */
export async function verifySupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  if (!supabaseUrl || !supabaseKey) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured',
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
