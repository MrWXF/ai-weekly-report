import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Session ID helper - generates a unique ID per browser
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("wr_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("wr_session_id", sessionId);
  }
  return sessionId;
}
