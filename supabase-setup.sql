-- Run this once in Supabase SQL Editor.
-- Then create your admin user in Authentication > Users.

create table if not exists public.products (
  id text primary key,
  image_url text default '',
  second_image_url text default '',
  name_ar text not null default '',
  name_fr text not null default '',
  description_ar text not null default '',
  description_fr text not null default '',
  benefits_ar jsonb not null default '[]'::jsonb,
  benefits_fr jsonb not null default '[]'::jsonb,
  price numeric not null default 0,
  old_price numeric,
  category text not null default 'Tech',
  badge text not null default 'New',
  active boolean not null default true,
  featured boolean not null default false,
  availability boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_slides (
  id integer primary key check (id in (1, 2)),
  image_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.hero_slides (id, image_url)
values (1, ''), (2, '')
on conflict (id) do nothing;

alter table public.products enable row level security;
alter table public.hero_slides enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
using (true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read hero slides" on public.hero_slides;
create policy "Public can read hero slides"
on public.hero_slides for select
using (true);

drop policy if exists "Admins can manage hero slides" on public.hero_slides;
create policy "Admins can manage hero slides"
on public.hero_slides for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
