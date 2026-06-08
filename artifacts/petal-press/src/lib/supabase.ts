import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Guard against missing env vars (e.g. external deployments without Supabase configured).
// The Welcome/waitlist page works without Supabase; garden features will fail gracefully.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      realtime: {
        params: { eventsPerSecond: 0 },
      },
    })
  : null;

export type FlowerRow = {
  id: string;
  common_name: string;
  latin_name: string;
  nickname: string;
  meaning: string;
  blurb: string;
  color: string;
  date_pressed: string;
  location: string;
  spotted_count: number;
  image_url: string;
  in_bouquet: boolean;
  created_at: string;
};
