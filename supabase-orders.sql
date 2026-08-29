-- My Business: Phase 2 Orders System
-- Run this SQL in Supabase Dashboard > SQL Editor.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  email text not null,
  whatsapp text,
  business_name text not null,
  logo_style text not null,
  price integer not null default 0,
  status text not null default 'Pending' check (status in ('Pending','In Progress','Completed','Cancelled')),
  details text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders" on public.orders
for insert to authenticated with check (auth.uid() = user_id);

create index if not exists orders_user_id_created_at_idx on public.orders(user_id, created_at desc);
