CREATE FUNCTION remove_from_business_storage () returns trigger language plpgsql security definer
SET
	search_path = '' AS $$
begin
  --delete picture from storage
  return new;
end;
$$;


CREATE TRIGGER after_business_images_delete
AFTER delete ON public.business_images FOR each ROW
EXECUTE procedure remove_from_business_storage ();


CREATE FUNCTION remove_from_product_storage () returns trigger language plpgsql security definer
SET
	search_path = '' AS $$
begin
  --delete picture from storage
  return new;
end;
$$;


CREATE TRIGGER after_product_images_delete
AFTER delete ON public.product_images FOR each ROW
EXECUTE procedure remove_from_product_storage ();


CREATE FUNCTION remove_from_profile_storage () returns trigger language plpgsql security definer
SET
	search_path = '' AS $$
begin
  --delete picture from storage
  return new;
end;
$$;


CREATE TRIGGER after_profile_picture_delete
AFTER delete ON public.profile_pictures FOR each ROW
EXECUTE procedure remove_from_profile_storage ();
