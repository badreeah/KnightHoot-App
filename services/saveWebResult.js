// services/saveWebResult.js
import supabase from "../supabase";

export const saveSafeResult = async (
  userId,
  url,
  domain,
  label,
  score,
  reasons
) => {
  const { error } = await supabase.from("Url_scans").insert({
    user_id: userId,
    url,
    domain,
    label,
    score,
    reasons,
  });

  if (error) {
    console.log("saveSafeResult error:", error);
    throw error;
  }
};

