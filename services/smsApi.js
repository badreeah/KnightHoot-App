// src/services/smsApi.js
import supabase from "../supabase";

export const analyzeSms = async (smsText) => {
  try {
    // استدعاء Edge Function أو REST API في Supabase
    const { data, error } = await supabase.functions.invoke("analyze-sms", {
      body: JSON.stringify({ text: smsText }),
    });

    if (error) {
      console.error("Supabase Function error:", error);
      return null;
    }

    return data; // النتيجة المتوقع ترجع مثل { label: "Spam" }
  } catch (err) {
    console.error("Error analyzing SMS:", err);
    return null;
  }
};

export const saveSmsResult = async (smsText, result) => {
  try {
    const { error } = await supabase
      .from("sms_logs") // اسم الجدول اللي بتخزين فيه الرسائل
      .insert([
        {
          message: smsText,
          result: result,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error("Error saving SMS result:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error saving SMS:", err);
    return false;
  }
};
