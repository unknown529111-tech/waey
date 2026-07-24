-- Explicit deny: no one can select/insert/update/delete via anon or authenticated keys.
-- Only the edge function (service role) bypasses RLS to insert messages.
CREATE POLICY "deny_all_select" ON public.contact_messages FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "deny_all_insert" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "deny_all_update" ON public.contact_messages FOR UPDATE TO anon, authenticated USING (false);
CREATE POLICY "deny_all_delete" ON public.contact_messages FOR DELETE TO anon, authenticated USING (false);