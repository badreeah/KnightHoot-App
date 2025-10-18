import "react-native-url-polyfill/auto"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { createClient, processLock } from "@supabase/supabase-js"; 
// رابط المشروع (Project URL) 
const SUPABASE_URL = "https://qsgrxnzljtoebmeqcpbp.supabase.co"; 
//  المفتاح العام (Anon Public Key) 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZ3J4bnpsanRvZWJtZXFjcGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MzQ1MTMsImV4cCI6MjA3NDIxMDUxM30.2sHDLxRF_dZp0tbZ5_Pefed3rsOoEfw5zMVAjEjIqZs"; 
export const supabase = createClient( SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false, lock: processLock,
  
 }, } ); export default supabase;