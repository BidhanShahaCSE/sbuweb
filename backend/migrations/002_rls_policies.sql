-- ============================================================================
-- Migration: 002_rls_policies.sql
-- Description: Row Level Security (RLS) policies for complete client/owner isolation
-- Compatible: PostgreSQL 14+ / Supabase
-- ============================================================================

-- ============================================================================
-- 1. Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_accounts ENABLE ROW LEVEL SECURITY;

-- Helper security function to verify active owner status
CREATE OR REPLACE FUNCTION public.is_active_owner(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.owner_accounts
        WHERE user_id = check_user_id
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. RLS Policies: public.client_profiles
-- ============================================================================

-- DROP existing policies if any
DROP POLICY IF EXISTS "Clients can view own profile or owner can view all" ON public.client_profiles;
DROP POLICY IF EXISTS "Clients can insert their own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Clients can update their own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Clients cannot delete their own profile directly" ON public.client_profiles;

-- Clients can view only their own profile; Active owners can view all client profiles
CREATE POLICY "Clients can view own profile or owner can view all"
    ON public.client_profiles
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = id
        OR public.is_active_owner(auth.uid())
    );

-- Clients can only insert a profile record for their own authenticated user ID
CREATE POLICY "Clients can insert their own profile"
    ON public.client_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = id
    );

-- Clients can update only their own profile
CREATE POLICY "Clients can update their own profile"
    ON public.client_profiles
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = id
    )
    WITH CHECK (
        auth.uid() = id
    );

-- ============================================================================
-- 3. RLS Policies: public.owner_accounts
-- ============================================================================
-- CRITICAL SECURITY RULE:
-- Public and client accounts CANNOT insert, update, or escalate privileges into owner_accounts.
-- Only server-side administrative service_role (or existing active owners for reading) have access.

DROP POLICY IF EXISTS "Owners can view owner account status" ON public.owner_accounts;
DROP POLICY IF EXISTS "Block all public and client inserts to owner_accounts" ON public.owner_accounts;
DROP POLICY IF EXISTS "Block all public and client updates to owner_accounts" ON public.owner_accounts;
DROP POLICY IF EXISTS "Block all public and client deletes to owner_accounts" ON public.owner_accounts;

-- An owner can view their own status
CREATE POLICY "Owners can view owner account status"
    ON public.owner_accounts
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
    );

-- Explicitly disallow public/client modifications through client keys.
-- Only the Supabase 'service_role' key bypasses RLS on the server to provision or modify owners.
CREATE POLICY "Block all public and client inserts to owner_accounts"
    ON public.owner_accounts
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (
        FALSE
    );

CREATE POLICY "Block all public and client updates to owner_accounts"
    ON public.owner_accounts
    FOR UPDATE
    TO authenticated, anon
    USING (
        FALSE
    );

CREATE POLICY "Block all public and client deletes to owner_accounts"
    ON public.owner_accounts
    FOR DELETE
    TO authenticated, anon
    USING (
        FALSE
    );
