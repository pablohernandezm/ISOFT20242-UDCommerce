CREATE FUNCTION public.is_business_member (business_id INT, userid UUID DEFAULT auth.uid ()) returns BOOLEAN AS $$
BEGIN
  return (exists(
    select 1 from public.business b 
    where b.id =  business_id
    and b.owner_id = userid
  ));
END;
$$ language plpgsql security invoker;


ALTER TABLE public.products enable ROW level security;


CREATE POLICY "All products can be selected" ON public.products FOR
SELECT
	TO authenticated,
	anon USING (TRUE);


CREATE POLICY "Products can be inserted only by its owner" ON public.products FOR insert TO authenticated
WITH
	CHECK (
		public.is_business_member (public.products.business_id)
	);


CREATE POLICY "Products can be updated only by its owner" ON public.products
FOR UPDATE
	TO authenticated USING (
		public.is_business_member (public.products.business_id)
	)
WITH
	CHECK (
		public.is_business_member (public.products.business_id)
	);


CREATE POLICY "Products can be deleted only by its owner" ON public.products FOR delete TO authenticated USING (
	public.is_business_member (public.products.business_id)
);
