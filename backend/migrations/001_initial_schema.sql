-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Creates client_profiles and owner_accounts tables referencing auth.users
-- Compatible: PostgreSQL 14+ / Supabase
-- ============================================================================

-- Ensure uuid-ossp or pgcrypto extension is available for UUID functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. Table: public.client_profiles
-- ============================================================================
-- Stores profile details for registered clients.
-- Foreign key references Supabase's built-in auth.users.id.
-- Email is NOT duplicated here; it is retrieved directly from auth.users.

CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(30) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Constraints
    CONSTRAINT chk_full_name_length CHECK (char_length(trim(full_name)) >= 2),
    CONSTRAINT chk_country_length CHECK (char_length(trim(country)) >= 2),
    CONSTRAINT chk_whatsapp_format CHECK (
        whatsapp_number IS NULL OR whatsapp_number ~ '^\+?[1-9]\d{6,14}$'
    )
);

-- Index for lookup and sorting
CREATE INDEX IF NOT EXISTS idx_client_profiles_country ON public.client_profiles(country);
CREATE INDEX IF NOT EXISTS idx_client_profiles_created_at ON public.client_profiles(created_at DESC);

-- Automatic updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_client_profiles_updated_at ON public.client_profiles;
CREATE TRIGGER trg_client_profiles_updated_at
    BEFORE UPDATE ON public.client_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 2. Table: public.owner_accounts
-- ============================================================================
-- Stores company-provisioned owner accounts.
-- Referenced strictly from auth.users(id).
-- Only provisioned via secure administrative server process. Never accessible for public inserts.

CREATE TABLE IF NOT EXISTS public.owner_accounts (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for rapid server-side owner status verification
CREATE INDEX IF NOT EXISTS idx_owner_accounts_active ON public.owner_accounts(user_id, is_active);

-- Comments documenting isolation
COMMENT ON TABLE public.client_profiles IS 'Stores client customer profile metadata. Linked 1:1 to auth.users.';
COMMENT ON TABLE public.owner_accounts IS 'Administrative company owner role registry. Managed strictly server-side.';
