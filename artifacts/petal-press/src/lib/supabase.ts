import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
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
  image_urls: string[];
  in_bouquet: boolean;
  user_id: string;
  created_at: string;
};
