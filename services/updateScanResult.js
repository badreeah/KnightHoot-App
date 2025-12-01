// src/services/updateScanResult.js
import supabase from "../supabase";

export async function updateScanResult(log_id, label, score, reasons) {
  const { data, error } = await supabase
    .from("safe_scans")
    .update({
      label: label,      // safe | notsafe | unknown
      score: score,      // رقم: 0 - 1
      reasons: reasons,  // string
    })
    .eq("id", log_id)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    return null;
  }

  return data;
}
