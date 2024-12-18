ALTER TABLE public.profiles enable ROW level security;


CREATE POLICY "All profiles can be selected" ON public.profiles FOR
SELECT
	TO authenticated,
	anon USING (TRUE);


CREATE POLICY "Profiles can be inserted only by its owner" ON public.profiles FOR insert TO authenticated
WITH
	CHECK (
		(
			SELECT
				auth.uid ()
		) = id
	);


CREATE POLICY "Profiles can be updated only by its owner" ON public.profiles
FOR UPDATE
	TO authenticated USING (
		(
			SELECT
				auth.uid ()
		) = id
	)
WITH
	CHECK (
		(
			SELECT
				auth.uid ()
		) = id
	);


CREATE POLICY "Profiles can be deleted only by its owner" ON public.profiles FOR delete TO authenticated USING (
	(
		SELECT
			auth.uid ()
	) = id
);


CREATE FUNCTION public.handle_remove_profile () returns trigger language plpgsql security definer
SET
	search_path = '' AS $$
begin
  delete from auth.users where  auth.users.id = old.id;

  return new;
end;
$$;


CREATE TRIGGER on_profile_deleted
AFTER delete ON public.profiles FOR each ROW
EXECUTE procedure public.handle_remove_profile ();
