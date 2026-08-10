-- Create a public Storage bucket for study sounds.
-- The MP3s (3 x 25MB) were moved out of git to slim the repository;
-- the app now streams them from Supabase Storage.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sounds', 'sounds', true, 31457280, array['audio/mpeg'])
on conflict (id) do nothing;

-- Public read access for the sounds bucket
drop policy if exists "sounds_public_read" on storage.objects;
create policy "sounds_public_read"
  on storage.objects for select
  using (bucket_id = 'sounds');