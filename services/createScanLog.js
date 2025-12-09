// src/services/createScanLog.js
import supabase from "../supabase";

export async function createScanLog(user_id, url, domain) {
  const { data, error } = await supabase
    .from("safe_url_scans")
    .insert([
      {
        user_id,
        url,
        domain,
        label: "unknown",  
        score: null,
        reasons: null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return null;
  }

  return data;  
}
