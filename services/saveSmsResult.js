<<<<<<< HEAD
// src/services/saveSmsResult.js
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * حفظ نتيجة رسالة SMS محليًا
 * @param {string} smsText - نص الرسالة
 * @param {string} result - نتيجة التحليل ("Spam" أو "Safe")
 * @returns {boolean} - true إذا نجح الحفظ، false إذا فشل
 */
export const saveSmsResult = async (smsText, result) => {
  try {
    // استرجاع السجل القديم
    const existingData = await AsyncStorage.getItem("sms_results");
    const smsList = existingData ? JSON.parse(existingData) : [];

    // إنشاء سجل جديد
    const newEntry = {
      id: Date.now(),
      message: smsText,
      result: result,
      date: new Date().toISOString(),
    };

    smsList.push(newEntry);

    // حفظ السجل المحدث
    await AsyncStorage.setItem("sms_results", JSON.stringify(smsList));

    return true;
  } catch (error) {
    console.error("Error saving SMS result:", error);
    return false;
  }
};

/**
 * استرجاع كل الرسائل المخزنة محليًا
 * @returns {Array} - قائمة الرسائل المخزنة
 */
export const getSavedSmsResults = async () => {
  try {
    const data = await AsyncStorage.getItem("sms_results");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading SMS results:", error);
    return [];
  }
};
=======
import { supabase } from "../services/supabase"; 
export async function saveSafeResult(userId, url, domain, label, score, reasons) {
    try {
        const { data, error } = await supabase.from("safe_scans").insert([
            {
                user_id: userId,
                url,
                domain,
                label,  // safe / notsafe
                score,
                reasons,
            },
        ]).select(); 

        if (error) {
            console.error("Could not save Result:", error.message);
            return null;
        }

        console.log("Result saved successfully.");
        return data; 
    } catch (err) {
        console.error("Unexpected error during save operation:", err);
        return null;
    }
}
>>>>>>> main
