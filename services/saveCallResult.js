import { supabase } from "../supabaseClient";

export async function saveCallResult(userId, prediction, confidence) {
  try {
    const { data, error } = await supabase.from("PhoneCalls").insert([
      {
        user_id: userId,
        prediction: prediction,
        confidence: confidence,
      },
    ]);
    if (error) {
      console.error("ERROR : could not save the call", error.message);
      return null;
    }
    console.log("✅ Call saved");
    return data;
  } catch (err) {
    console.error("⚠️ Unexpected error:", err);
    return null;
  }
}
