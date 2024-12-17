create function public.is_business_member(business_id int, userid uuid default auth.uid())
returns boolean 
as $$
BEGIN
  return (exists(
    select 1 from public.business b 
    where b.id =  business_id
    and b.owner_id = userid
  ));
END;
$$ language plpgsql security invoker;

alter  table public.products enable row level security;

create policy "All products can be selected"
on public.products for select to authenticated, anon 
  using(true);

create policy "Products can be inserted only by its owner"
on public.products for insert to authenticated
  with check (
    public.is_business_member(public.products.business_id)
);

create policy "Products can be updated only by its owner"
on public.products for update to authenticated
using (  
  public.is_business_member(public.products.business_id)
) 
with check (
  public.is_business_member(public.products.business_id)
);

create policy "Products can be deleted only by its owner"
on public.products for delete to authenticated
using (
  public.is_business_member(public.products.business_id)
);
