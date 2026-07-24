# Supabase Secrets Setup
# Run these in your terminal after installing Supabase CLI:
# npm install -g supabase
# supabase login
# supabase link --project-ref YOUR_PROJECT_REF

# Then set secrets:
supabase secrets set GROQ_API_KEY="your-groq-key-here"
supabase secrets set RESEND_API_KEY="your-resend-key-here"

# Deploy functions:
supabase functions deploy ai-assistant
supabase functions deploy send-contact

# Verify:
supabase functions list