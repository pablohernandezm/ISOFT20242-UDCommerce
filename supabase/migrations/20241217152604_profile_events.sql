alter  table public.profiles enable row level security;

create policy "All profiles can be selected"
on public.profiles for select to authenticated, anon
  using(true);

create policy "Profiles can be inserted only by its owner"
on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Profiles can be updated only by its owner"
on public.profiles for update to authenticated
using ((select auth.uid()) = id) 
with check ((select auth.uid())=id);

create policy "Profiles can be deleted only by its owner"
on public.profiles for delete to authenticated
using ((select auth.uid())=id);

create function public.handle_remove_profile()
returns trigger 
language plpgsql
security definer set search_path=''
as $$
begin
  delete from auth.users where  auth.users.id = old.id;

  return new;
end;
$$;

create  trigger on_profile_deleted
after delete on public.profiles
for each row execute procedure public.handle_remove_profile();
