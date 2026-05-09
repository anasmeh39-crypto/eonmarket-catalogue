import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yccojpzfmtytqrbvlwnb.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_02f38F_x-lOCBt9GeKMQpw_5gYasFsb'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
