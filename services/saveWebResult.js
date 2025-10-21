// services/saveSafeResult.js
import supabase from "../supabase";

export async function saveSafeResult(userId, url, domain, label, score, reasons) {
  try {
    const { data, error } = await supabase.from("safe_scans").insert([
      {
        user_id: userId,
        url,
        domain,
        label,   // safe / notsafe
        score,
        reasons,
      },
    ]);

    if (error) {
      console.error("❌ Could not save SafeBrowsing result:", error.message);
      return null;
    }

    console.log("✅ SafeBrowsing result saved");
    return data;
  } catch (err) {
    console.error("⚠️ Unexpected error:", err);
    return null;
  }
}
