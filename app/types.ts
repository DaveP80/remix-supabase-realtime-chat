import type { Session, SupabaseClient } from "@supabase/supabase-js";

export type OutletContext = {
  supabase: SupabaseClient;
  session: Session;
};

type UserData <T> = {
  user_meta_data: T;
}

export interface Message {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
  user_meta_data?: {name?: string, profile_image?: string};
}

export interface GPTMessage extends Message {
  is_gpt: boolean;
}

export type ActionReturnType =
  | { summary: string; gpt_message: string }
  | { summary: null; gpt_message: string }
  | any;

