import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ljujmlveixtmrncefhfi.supabase.com'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdWptbHZlaXh0bXJuY2VmaGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjA0ODUsImV4cCI6MjA2NTUzNjQ4NX0.ujk6O5Ucp0VEoEfVZENnVq-F3a4WJvUFIiv5BQees8A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)