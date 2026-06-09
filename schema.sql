-- Civitas Supabase PostgreSQL Schema & RLS Policies (Normalized Organizations & Roles)
-- Execute this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/ntqzjjfwqralwbkqktim/sql)

-- Clean up old schema
drop table if exists public.prestacao_contas cascade;
drop table if exists public.evidencias cascade;
drop table if exists public.fornecedores cascade;
drop table if exists public.recursos cascade;
drop table if exists public.editais cascade;
drop table if exists public.projects cascade;
drop table if exists public.profiles cascade;
drop table if exists public.tenants cascade;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user cascade;
drop function if exists public.current_user_tenant_id cascade;
drop function if exists public.current_user_role cascade;
drop function if exists public.create_new_tenant cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Roles lookup table
create table public.roles (
    name text primary key,
    description text
);

-- Insert initial profiles/roles
insert into public.roles (name, description) values
    ('admin', 'Administrador da Organização - Acesso total'),
    ('gestor', 'Gestor de Projetos - Gerencia editais, captações e projetos'),
    ('financeiro', 'Financeiro - Controle de prestação de contas e recursos'),
    ('auditor', 'Auditor - Valida evidências e prestação de contas'),
    ('patrocinador', 'Patrocinador - Visualiza portal de transparência e relatórios de projetos parceiros'),
    ('fornecedor', 'Fornecedor - Apenas visualização de dados vinculados e emissão de notas/comprovantes');

-- 2. Create Organizations Table
create table public.organizations (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.organizations enable row level security;

-- 3. Create User Profiles Table
create table public.user_profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_profiles enable row level security;

-- 4. Create Organization Members Table (Mapping users to organizations and roles)
create table public.organization_members (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid references public.organizations(id) on delete cascade not null,
    user_id uuid references public.user_profiles(id) on delete cascade not null,
    role text references public.roles(name) on delete restrict not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_organization_member unique (organization_id, user_id)
);

alter table public.organization_members enable row level security;

-- 5. Helper Functions & Triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Security helper functions
create or replace function public.current_user_organization_id()
returns uuid security definer as $$
begin
  return (select organization_id from public.organization_members where user_id = auth.uid() limit 1);
end;
$$ language plpgsql;

create or replace function public.current_user_role()
returns text security definer as $$
begin
  return (select role from public.organization_members where user_id = auth.uid() limit 1);
end;
$$ language plpgsql;

-- 6. RLS Policies
-- Organizations Policies
create policy "Users can view their organization"
    on public.organizations for select
    using (id = public.current_user_organization_id());

create policy "Admins can update their organization"
    on public.organizations for update
    using (id = public.current_user_organization_id() and public.current_user_role() = 'admin');

-- User Profiles Policies
create policy "Users can view profiles in their organization"
    on public.user_profiles for select
    using (
        id = auth.uid() 
        or exists (
            select 1 from public.organization_members 
            where user_id = public.user_profiles.id 
              and organization_id = public.current_user_organization_id()
        )
    );

create policy "Users can update their own profile"
    on public.user_profiles for update
    using (auth.uid() = id);

-- Organization Members Policies
create policy "Members can view organization memberships"
    on public.organization_members for select
    using (organization_id = public.current_user_organization_id());

create policy "Admins can manage organization memberships"
    on public.organization_members for all
    using (organization_id = public.current_user_organization_id() and public.current_user_role() = 'admin');

-- 7. Secure Transaction RPC for registering organization and setting admin member
create or replace function public.create_new_organization(org_name text, org_slug text)
returns public.organizations security definer as $$
declare
  new_org public.organizations;
begin
  -- Ensure user profile exists in user_profiles to prevent foreign key violations (healing fallback)
  insert into public.user_profiles (id, full_name)
  values (auth.uid(), coalesce(auth.jwt()->'user_metadata'->>'full_name', 'Administrador'))
  on conflict (id) do nothing;

  -- 1. Insert organization
  insert into public.organizations (name, slug)
  values (org_name, org_slug)
  returning * into new_org;

  -- 2. Create membership as 'admin'
  insert into public.organization_members (organization_id, user_id, role)
  values (new_org.id, auth.uid(), 'admin');

  return new_org;
end;
$$ language plpgsql;

-- 8. Modules Tables (with renamed organization_id references and RLS)
create table public.projects (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid default public.current_user_organization_id() references public.organizations(id) on delete cascade not null,
    name text not null,
    description text,
    status text default 'planning'::text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.projects enable row level security;
create policy "Members can manage projects" on public.projects for all using (organization_id = public.current_user_organization_id());

create table public.editais (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid default public.current_user_organization_id() references public.organizations(id) on delete cascade not null,
    title text not null,
    sponsor text not null,
    value numeric(12,2),
    deadline timestamp with time zone,
    status text default 'draft'::text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.editais enable row level security;
create policy "Members can manage editais" on public.editais for all using (organization_id = public.current_user_organization_id());

create table public.recursos (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid default public.current_user_organization_id() references public.organizations(id) on delete cascade not null,
    source text not null,
    amount numeric(12,2) not null,
    date date default current_date not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.recursos enable row level security;
create policy "Members can manage recursos" on public.recursos for all using (organization_id = public.current_user_organization_id());

create table public.fornecedores (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid default public.current_user_organization_id() references public.organizations(id) on delete cascade not null,
    name text not null,
    document text,
    email text,
    phone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.fornecedores enable row level security;
create policy "Members can manage fornecedores" on public.fornecedores for all using (organization_id = public.current_user_organization_id());

create table public.evidencias (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid default public.current_user_organization_id() references public.organizations(id) on delete cascade not null,
    project_id uuid references public.projects(id) on delete cascade,
    title text not null,
    description text,
    file_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.evidencias enable row level security;
create policy "Members can manage evidencias" on public.evidencias for all using (organization_id = public.current_user_organization_id());

create table public.prestacao_contas (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid default public.current_user_organization_id() references public.organizations(id) on delete cascade not null,
    project_id uuid references public.projects(id) on delete cascade,
    title text not null,
    type text not null, -- 'revenue' or 'expense'
    amount numeric(12,2) not null,
    status text default 'pending'::text,
    date date default current_date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.prestacao_contas enable row level security;
create policy "Members can manage prestacao_contas" on public.prestacao_contas for all using (organization_id = public.current_user_organization_id());
