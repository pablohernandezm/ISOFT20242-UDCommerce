alter table public.business enable row level security;

create policy "All business can be selected"
on public.business for select to authenticated, anon 
  using (true);

create policy "Business can be inserted only by its owner"
on public.business for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Business can be updated only by its owner"
on public.business for update to authenticated
using ((select auth.uid()) = owner_id) 
with check ((select auth.uid())=owner_id);

create policy "Business can be deleted only by its owner"
on public.business for delete to authenticated
using ((select auth.uid())=owner_id);
