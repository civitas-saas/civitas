-- Civitas Supabase PostgreSQL Schema & RLS Policies
-- Execute this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/ntqzjjfwqralwbkqktim/sql)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tenants Table (NGOs/Organizations)
create table if not exists public.tenants (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Tenants
alter table public.tenants enable row level security;

-- 2. Profiles Table (User settings & tenant assignment)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    tenant_id uuid references public.tenants(id) on delete set null,
    full_name text,
    role text default 'member'::text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- 3. Automatic Profile Creation Trigger on Sign-Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'member')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Remove the trigger if it exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. RLS Helper functions
create or replace function public.current_user_tenant_id()
returns uuid security definer as $$
begin
  return (select tenant_id from public.profiles where id = auth.uid());
end;
$$ language plpgsql;

create or replace function public.current_user_role()
returns text security definer as $$
begin
  return (select role from public.profiles where id = auth.uid());
end;
$$ language plpgsql;

-- 5. Tenants Policies
create policy "Users can view their own tenant"
    on public.tenants for select
    using (id = public.current_user_tenant_id());

create policy "Admins can update their own tenant"
    on public.tenants for update
    using (
        id = public.current_user_tenant_id() 
        and public.current_user_role() = 'admin'
    );

-- 6. Profiles Policies
create policy "Users can view profiles in their tenant"
    on public.profiles for select
    using (tenant_id = public.current_user_tenant_id() or auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Admins can insert/delete profiles in their tenant"
    on public.profiles for all
    using (
        tenant_id = public.current_user_tenant_id() 
        and public.current_user_role() = 'admin'
    );

-- 7. Module Tables with Multi-Tenant RLS

-- Projects Table
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    tenant_id uuid default public.current_user_tenant_id() references public.tenants(id) on delete cascade not null,
    name text not null,
    description text,
    status text default 'planning'::text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.projects enable row level security;

create policy "Tenant members can manage projects"
    on public.projects for all
    using (tenant_id = public.current_user_tenant_id());

-- Editais Table (Grants/Proposals)
create table if not exists public.editais (
    id uuid default gen_random_uuid() primary key,
    tenant_id uuid default public.current_user_tenant_id() references public.tenants(id) on delete cascade not null,
    title text not null,
    sponsor text not null,
    value numeric(12,2),
    deadline timestamp with time zone,
    status text default 'draft'::text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.editais enable row level security;

create policy "Tenant members can manage editais"
    on public.editais for all
    using (tenant_id = public.current_user_tenant_id());

-- Captação de Recursos Table (Fundraising)
create table if not exists public.recursos (
    id uuid default gen_random_uuid() primary key,
    tenant_id uuid default public.current_user_tenant_id() references public.tenants(id) on delete cascade not null,
    source text not null,
    amount numeric(12,2) not null,
    date date default current_date not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.recursos enable row level security;

create policy "Tenant members can manage recursos"
    on public.recursos for all
    using (tenant_id = public.current_user_tenant_id());

-- Fornecedores Table (Suppliers)
create table if not exists public.fornecedores (
    id uuid default gen_random_uuid() primary key,
    tenant_id uuid default public.current_user_tenant_id() references public.tenants(id) on delete cascade not null,
    name text not null,
    document text,
    email text,
    phone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.fornecedores enable row level security;

create policy "Tenant members can manage fornecedores"
    on public.fornecedores for all
    using (tenant_id = public.current_user_tenant_id());

-- Evidências Table (Evidences)
create table if not exists public.evidencias (
    id uuid default gen_random_uuid() primary key,
    tenant_id uuid default public.current_user_tenant_id() references public.tenants(id) on delete cascade not null,
    project_id uuid references public.projects(id) on delete cascade,
    title text not null,
    description text,
    file_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.evidencias enable row level security;

create policy "Tenant members can manage evidencias"
    on public.evidencias for all
    using (tenant_id = public.current_user_tenant_id());

-- Prestação de Contas Table (Financial Reports)
create table if not exists public.prestacao_contas (
    id uuid default gen_random_uuid() primary key,
    tenant_id uuid default public.current_user_tenant_id() references public.tenants(id) on delete cascade not null,
    project_id uuid references public.projects(id) on delete cascade,
    title text not null,
    type text not null, -- 'revenue' or 'expense'
    amount numeric(12,2) not null,
    status text default 'pending'::text,
    date date default current_date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.prestacao_contas enable row level security;

create policy "Tenant members can manage prestacao_contas"
    on public.prestacao_contas for all
    using (tenant_id = public.current_user_tenant_id());
