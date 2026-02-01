-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- POSTS (Generated Content)
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  content text, -- Markdown content
  seo_score integer default 0,
  keywords text[],
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Posts
alter table public.posts enable row level security;

create policy "Users can view own posts."
  on posts for select
  using ( auth.uid() = user_id );

create policy "Users can insert own posts."
  on posts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own posts."
  on posts for update
  using ( auth.uid() = user_id );

create policy "Users can delete own posts."
  on posts for delete
  using ( auth.uid() = user_id );

-- SUBSCRIPTIONS (Mock for now, easy to hook up with Stripe later)
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  status text check (status in ('active', 'canceled', 'past_due')),
  plan_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Subscriptions
alter table public.subscriptions enable row level security;

create policy "Users can view own subscription."
  on subscriptions for select
  using ( auth.uid() = user_id );

-- TRIGGERS
-- Handle new user signup -> create profile
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
