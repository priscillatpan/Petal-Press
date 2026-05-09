import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
