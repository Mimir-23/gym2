import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kmxcnfsdggfdzdugdzqd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteGNuZnNkZ2dmZHpkdWdkenFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTMzNDYsImV4cCI6MjA2MTE4OTM0Nn0.2GYefpyuZSMU3oWk8v9ZCraRj8a59vOro-ZdHi4FaCY'

export const supabase = createClient(supabaseUrl, supabaseKey)
