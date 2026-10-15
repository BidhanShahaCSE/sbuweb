-- ============================================================================
-- Migration: 001_auth_tables.sql
-- Description: Client profiles and owner accounts tables with Row Level Security (RLS)
-- Compatible: PostgreSQL 14+ / Supabase
-- ============================================================================

-- 1. Client Profiles Table
-- Linked 1:1 to Supabase auth.users. Stores client customer details.
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(30) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT chk_full_name_length CHECK (char_length(trim(full_name)) >= 2),
    CONSTRAINT chk_country_length CHECK (char_length(trim(country)) >= 2)
);

-- 2. Owner Accounts Table
-- Registry of company-provisioned administrative accounts.
-- Never allows public registration or client profile creation.
CREATE TABLE IF NOT EXISTS public.owner_accounts (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_client_profiles_country ON public.client_profiles(country);
CREATE INDEX IF NOT EXISTS idx_owner_accounts_active ON public.owner_accounts(user_id, is_active);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_accounts ENABLE ROW LEVEL SECURITY;

-- Client Profiles: Users can view and update only their own profile
CREATE POLICY "Clients can view own profile"
    ON public.client_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Clients can insert own profile"
    ON public.client_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Clients can update own profile"
    ON public.client_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Owner Accounts: Owners can view their own record; public inserts/updates are blocked
CREATE POLICY "Owners can view own account status"
    ON public.owner_accounts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Block public client insertion and modification to owner_accounts.
-- Only Supabase service_role key can provision or alter owners.
CREATE POLICY "Prevent client insert to owner_accounts"
    ON public.owner_accounts
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (FALSE);

CREATE POLICY "Prevent client update to owner_accounts"
    ON public.owner_accounts
    FOR UPDATE
    TO authenticated, anon
    USING (FALSE);
