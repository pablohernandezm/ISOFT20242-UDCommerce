CREATE TABLE PROFILES(
  id uuid primary key,
  first_name varchar,
  last_name varchar,

  foreign key (id) references auth.users(id) on delete cascade on update cascade
);

CREATE TABLE PROFILE_PICTURES(
  profile_id uuid primary key,
  image varchar not null,
  foreign key (profile_id) references PROFILES(id) on delete cascade on update cascade
);

CREATE TABLE BUSINESS(
  id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name VARCHAR not null,
  description TEXT,
  location POINT,
  owner_id UUID NOT NULL,
  phone VARCHAR,

  foreign key (owner_id) references PROFILES(id) on delete cascade on update cascade
);

CREATE TABLE BUSINESS_IMAGES(
  id INT primary key GENERATED BY DEFAULT AS IDENTITY,
  business_id INTEGER not null,
  image varchar not null,
  FOREIGN KEY (business_id) references BUSINESS(id) on delete cascade on update cascade
);

create table PRODUCTS(
  id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name varchar not null,
  price numeric(12,2) not null check(price>=0),
  description text,
  business_id int not null,
  FOREIGN KEY (business_id) REFERENCES public.business(id) on delete cascade on update cascade
);

create table PRODUCT_IMAGES(
  id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  image varchar not null,
  product_id int not null,
  FOREIGN KEY (product_id) REFERENCES public.products(id) on delete cascade on update cascade
);

create table REVIEWS(
  id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  rating numeric(3,2) CHECK (rating>=0 AND rating<=5) not null,
  comment text,
  author_id uuid not null,
  business_id int not null,
  foreign key (author_id) references public.profiles(id) on delete cascade on update cascade,
  foreign key (business_id) references public.business(id) on delete cascade on update cascade,
  unique(author_id, business_id)
);

-- inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');

  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
