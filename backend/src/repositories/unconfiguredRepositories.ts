import {
  IAuthRepository,
  IClientProfileRepository,
  IOwnerAccountRepository,
} from './interfaces.js';
import { AuthUser, ClientProfile, OwnerAccount } from '../types/auth.types.js';
import {
  ClientRegisterInput,
  ClientLoginInput,
  OwnerLoginInput,
  UpdateClientProfileInput,
} from '../schemas/auth.schemas.js';
import { ServiceUnavailableError } from '../errors/appError.js';

/**
 * UnconfiguredAuthRepository
 * 
 * Implements IAuthRepository when Supabase connection is pending.
 * Guarantees that no fake tokens, fake sessions, or in-memory passwords are generated.
 * Returns HTTP 503 SERVICE_UNAVAILABLE until real Supabase client is supplied.
 */
export class UnconfiguredAuthRepository implements IAuthRepository {
  async registerClient(_input: ClientRegisterInput): Promise<{ user: AuthUser; token?: string }> {
    throw new ServiceUnavailableError(
      'Authentication provider (Supabase Auth) is not connected. User registration is currently unavailable.'
    );
  }

  async loginClient(_input: ClientLoginInput): Promise<{ user: AuthUser; token: string }> {
    throw new ServiceUnavailableError(
      'Authentication provider (Supabase Auth) is not connected. Client login is currently unavailable.'
    );
  }

  async loginOwner(_input: OwnerLoginInput): Promise<{ user: AuthUser; token: string }> {
    throw new ServiceUnavailableError(
      'Authentication provider (Supabase Auth) is not connected. Owner login is currently unavailable.'
    );
  }

  async logout(_token: string): Promise<void> {
    throw new ServiceUnavailableError(
      'Authentication provider (Supabase Auth) is not connected. Session invalidation is currently unavailable.'
    );
  }

  async validateToken(_token: string): Promise<AuthUser> {
    throw new ServiceUnavailableError(
      'Authentication provider (Supabase Auth) is not connected. Token verification is currently unavailable.'
    );
  }
}

/**
 * UnconfiguredClientProfileRepository
 * 
 * Implements IClientProfileRepository when PostgreSQL/Supabase database is pending.
 * Avoids any mock database persistence or fake state mutation.
 */
export class UnconfiguredClientProfileRepository implements IClientProfileRepository {
  async createProfile(_profile: {
    id: string;
    fullName: string;
    country: string;
    whatsappNumber?: string | null;
  }): Promise<ClientProfile> {
    throw new ServiceUnavailableError(
      'Database connection is not configured. Profile creation is currently unavailable.'
    );
  }

  async getProfileById(_id: string): Promise<ClientProfile | null> {
    throw new ServiceUnavailableError(
      'Database connection is not configured. Profile retrieval is currently unavailable.'
    );
  }

  async updateProfile(_id: string, _data: UpdateClientProfileInput): Promise<ClientProfile> {
    throw new ServiceUnavailableError(
      'Database connection is not configured. Profile update is currently unavailable.'
    );
  }
}

/**
 * UnconfiguredOwnerAccountRepository
 * 
 * Implements IOwnerAccountRepository when PostgreSQL/Supabase database is pending.
 * Ensures owner verification fails safe (503 Service Unavailable) without granting unauthorized access.
 */
export class UnconfiguredOwnerAccountRepository implements IOwnerAccountRepository {
  async getOwnerAccountByUserId(_userId: string): Promise<OwnerAccount | null> {
    throw new ServiceUnavailableError(
      'Database connection is not configured. Owner account lookup is currently unavailable.'
    );
  }

  async isUserActiveOwner(_userId: string): Promise<boolean> {
    throw new ServiceUnavailableError(
      'Database connection is not configured. Owner role verification is currently unavailable.'
    );
  }

  async provisionOwnerAccount(_userId: string): Promise<OwnerAccount> {
    throw new ServiceUnavailableError(
      'Database connection is not configured. Owner provisioning is currently unavailable.'
    );
  }
}
