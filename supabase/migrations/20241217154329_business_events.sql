ALTER TABLE public.business enable ROW level security;


CREATE POLICY "All business can be selected" ON public.business FOR
SELECT
	TO authenticated,
	anon USING (TRUE);


CREATE POLICY "Business can be inserted only by its owner" ON public.business FOR insert TO authenticated
WITH
	CHECK (
		(
			SELECT
				auth.uid ()
		) = owner_id
	);


CREATE POLICY "Business can be updated only by its owner" ON public.business
FOR UPDATE
	TO authenticated USING (
		(
			SELECT
				auth.uid ()
		) = owner_id
	)
WITH
	CHECK (
		(
			SELECT
				auth.uid ()
		) = owner_id
	);


CREATE POLICY "Business can be deleted only by its owner" ON public.business FOR delete TO authenticated USING (
	(
		SELECT
			auth.uid ()
	) = owner_id
);
