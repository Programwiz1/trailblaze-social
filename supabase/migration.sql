
insert into storage.buckets (id, name)
values ('post-images', 'post-images');

create policy "Anyone can view post images"
on storage.objects for select
using ( bucket_id = 'post-images' );

create policy "Authenticated users can upload post images"
on storage.objects for insert
with check (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);
