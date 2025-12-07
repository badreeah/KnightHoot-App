import { supabase } from "../services/supabase"; 
export async function saveSafeResult(userId, url, domain, label, score, reasons) {
    try {
        const { data, error } = await supabase.from("Url_scans").insert([
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