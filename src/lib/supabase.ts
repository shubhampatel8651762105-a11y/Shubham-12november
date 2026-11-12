import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'nkeaoppxgdgnrtlbhutd';
export const SUPABASE_URL =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_fVHcXWh_4aF7MYOUoccmJA_gYjERQLp';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const SUPABASE_SQL_SCHEMA = `-- Run this in Supabase Dashboard (Project: ${SUPABASE_PROJECT_ID}) -> SQL Editor:
-- https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    meeting_mode TEXT DEFAULT 'Virtual Video Call',
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public/anon and authenticated users to submit appointments
DROP POLICY IF EXISTS "Allow public insert to appointments" ON public.appointments;
CREATE POLICY "Allow public insert to appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow reading appointments
DROP POLICY IF EXISTS "Allow public select on appointments" ON public.appointments;
CREATE POLICY "Allow public select on appointments"
ON public.appointments
FOR SELECT
TO anon, authenticated
USING (true);
`;

export interface SupabaseAppointmentPayload {
  name: string;
  email: string;
  phone: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  meeting_mode?: string;
  notes?: string;
  status?: string;
}

/**
 * Check if the Supabase project connection is active and if the appointments table exists.
 */
export async function checkSupabaseTableStatus(): Promise<{
  connected: boolean;
  tableExists: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.from('appointments').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return { connected: true, tableExists: false, error: 'Table public.appointments not found' };
      }
      return { connected: true, tableExists: false, error: error.message };
    }

    return { connected: true, tableExists: true };
  } catch (err: any) {
    return { connected: false, tableExists: false, error: err?.message || 'Connection failed' };
  }
}

/**
 * Insert an appointment into Supabase.
 */
export async function insertAppointmentToSupabase(payload: SupabaseAppointmentPayload) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (error) {
      const isMissingTable =
        error.code === 'PGRST205' || error.message.includes('Could not find the table');
      return {
        success: false,
        tableMissing: isMissingTable,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      data: data?.[0] || null,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to submit appointment to Supabase',
    };
  }
}

/**
 * Fetch all appointments from Supabase
 */
export async function fetchAppointmentsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch appointments', data: [] };
  }
}
