ALTER TABLE public.reviews enable ROW level security;


CREATE POLICY "All reviews can be selected" ON public.reviews FOR
SELECT
	TO authenticated,
	anon USING (TRUE);


CREATE POLICY "Reviews can be inserted only by its author" ON public.reviews FOR insert TO authenticated
WITH
	CHECK (
		public.reviews.author_id = (
			SELECT
				auth.uid ()
		)
	);


CREATE POLICY "Reviews can be updated only by its author" ON public.reviews
FOR UPDATE
	TO authenticated USING (
		public.reviews.author_id = (
			SELECT
				auth.uid ()
		)
	)
WITH
	CHECK (
		public.reviews.author_id = (
			SELECT
				auth.uid ()
		)
	);


CREATE POLICY "reviews can be deleted only by its author" ON public.reviews FOR delete TO authenticated USING (
	public.reviews.author_id = (
		SELECT
			auth.uid ()
	)
);
