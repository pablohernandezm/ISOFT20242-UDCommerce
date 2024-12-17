alter table public.reviews enable row level security;

create policy "All reviews can be selected"
on public.reviews for select to authenticated, anon 
  using(true);

create policy "Reviews can be inserted only by its author"
on public.reviews for insert to authenticated
with check (
  public.reviews.author_id = (select auth.uid())
);

create policy "Reviews can be updated only by its author"
on public.reviews for update to authenticated
using (  
  public.reviews.author_id = (select auth.uid())
) 
with check (
  public.reviews.author_id = (select auth.uid())
);

create policy "reviews can be deleted only by its author"
on public.reviews for delete to authenticated
using (
  public.reviews.author_id = (select auth.uid())
);
