
-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- Allow public read access to profiles
create policy "Public profiles are viewable by everyone"
on profiles for select
to authenticated, anon
using (true);
