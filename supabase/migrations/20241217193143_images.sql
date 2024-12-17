-- BUSINESS IMAGES
alter table public.business_images enable row level security;

create policy "All Business images can be selected"
on public.business_images for select to authenticated, anon 
  using(true);

create policy "Business images can be inserted only by the business owner"
on public.business_images for insert to authenticated
  with check (
    public.is_business_member(public.business_images.business_id)
);

create policy "Business images can be updated only by the business owner"
on public.business_images for update to authenticated
using (  
  public.is_business_member(public.business_images.business_id)
) 
with check (
  public.is_business_member(public.business_images.business_id)
);

create policy "Business images can be deleted only by the business owner"
on public.business_images for delete to authenticated
using (
  public.is_business_member(public.business_images.business_id)
);


-- PRODUCT IMAGES
create function public.is_business_member_from_product(product_id int, userid uuid default auth.uid())
returns boolean 
as $$
BEGIN
  return (exists(
    select 1 from public.products p 
    inner join public.business b on b.id = p.business_id 
    where p.id =  product_id
    and b.owner_id = userid
  ));
END;
$$ language plpgsql security invoker;


alter table public.product_images enable row level security;

create policy "All product images can be selected"
on public.product_images for select to authenticated, anon 
  using(true);

create policy "Product images can be inserted only by the business owner"
on public.product_images for insert to authenticated
  with check (
    public.is_business_member_from_product(public.product_images.product_id)
);

create policy "Product images can be updated only by the business owner"
on public.product_images for update to authenticated
using (  
  public.is_business_member_from_product(public.product_images.product_id)
) 
with check (
  public.is_business_member_from_product(public.product_images.product_id)
);

create policy "Product images can be deleted only by the business owner"
on public.product_images for delete to authenticated
using (
  public.is_business_member_from_product(public.product_images.product_id)
);


-- PROFILE PICTURES
alter table public.profile_pictures enable row level security;

create policy "All profile pictures can be selected"
on public.profile_pictures for select to authenticated, anon
using (true);

create policy "Profile pictures can be inserted by its owner"
on public.profile_pictures for insert to authenticated, anon
with check(profile_id = (select auth.uid()));

create policy "Profile pictures can be updated by its owner"
on public.profile_pictures for update to authenticated, anon
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

create policy "Profile pictures can be deleted by its owner"
on public.profile_pictures for delete to authenticated, anon
using (profile_id = (select auth.uid()));
