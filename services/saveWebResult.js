// src/services/saveSmsResult.js
import { supabase } from "../supabase";

export async function updateSmsScanResult(
  log_id,
  classification,
  score,
  details
) {
  try {
    const { data, error } = await supabase
      .from("communication_logs")
      .update({
        classification_response: classification,
        score: score,
        details: details,
      })
      .eq("id", log_id);

    if (error) {
      console.error(`Supabase UPDATE Error for ID ${log_id}:`, error.message);
      return false;
    }

    console.log(`Log ID ${log_id} updated successfully.`);
    return true;
  } catch (err) {
    console.error("Unexpected error during update operation:", err);
    return false;
  }
}
