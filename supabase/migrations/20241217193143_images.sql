-- BUSINESS IMAGES
ALTER TABLE public.business_images enable ROW level security;


CREATE POLICY "All Business images can be selected" ON public.business_images FOR
SELECT
	TO authenticated,
	anon USING (TRUE);


CREATE POLICY "Business images can be inserted only by the business owner" ON public.business_images FOR insert TO authenticated
WITH
	CHECK (
		public.is_business_member (public.business_images.business_id)
	);


CREATE POLICY "Business images can be updated only by the business owner" ON public.business_images
FOR UPDATE
	TO authenticated USING (
		public.is_business_member (public.business_images.business_id)
	)
WITH
	CHECK (
		public.is_business_member (public.business_images.business_id)
	);


CREATE POLICY "Business images can be deleted only by the business owner" ON public.business_images FOR delete TO authenticated USING (
	public.is_business_member (public.business_images.business_id)
);


-- PRODUCT IMAGES
CREATE FUNCTION public.is_business_member_from_product (product_id INT, userid UUID DEFAULT auth.uid ()) returns BOOLEAN AS $$
BEGIN
  return (exists(
    select 1 from public.products p 
    inner join public.business b on b.id = p.business_id 
    where p.id =  product_id
    and b.owner_id = userid
  ));
END;
$$ language plpgsql security invoker;


ALTER TABLE public.product_images enable ROW level security;


CREATE POLICY "All product images can be selected" ON public.product_images FOR
SELECT
	TO authenticated,
	anon USING (TRUE);


CREATE POLICY "Product images can be inserted only by the business owner" ON public.product_images FOR insert TO authenticated
WITH
	CHECK (
		public.is_business_member_from_product (public.product_images.product_id)
	);


CREATE POLICY "Product images can be updated only by the business owner" ON public.product_images
FOR UPDATE
	TO authenticated USING (
		public.is_business_member_from_product (public.product_images.product_id)
	)
WITH
	CHECK (
		public.is_business_member_from_product (public.product_images.product_id)
	);


CREATE POLICY "Product images can be deleted only by the business owner" ON public.product_images FOR delete TO authenticated USING (
	public.is_business_member_from_product (public.product_images.product_id)
);


-- PROFILE PICTURES
ALTER TABLE public.profile_pictures enable ROW level security;


CREATE POLICY "All profile pictures can be selected" ON public.profile_pictures FOR
SELECT
	TO authenticated,
	anon USING (TRUE);


CREATE POLICY "Profile pictures can be inserted by its owner" ON public.profile_pictures FOR insert TO authenticated,
anon
WITH
	CHECK (
		profile_id = (
			SELECT
				auth.uid ()
		)
	);


CREATE POLICY "Profile pictures can be updated by its owner" ON public.profile_pictures
FOR UPDATE
	TO authenticated,
	anon USING (
		profile_id = (
			SELECT
				auth.uid ()
		)
	)
WITH
	CHECK (
		profile_id = (
			SELECT
				auth.uid ()
		)
	);


CREATE POLICY "Profile pictures can be deleted by its owner" ON public.profile_pictures FOR delete TO authenticated,
anon USING (
	profile_id = (
		SELECT
			auth.uid ()
	)
);
