import { AuthUser, ClientProfile, OwnerAccount } from '../types/auth.types.js';
import {
  ClientRegisterInput,
  ClientLoginInput,
  OwnerLoginInput,
  UpdateClientProfileInput,
} from '../schemas/auth.schemas.js';

export interface IAuthRepository {
  registerClient(input: ClientRegisterInput): Promise<{ user: AuthUser; token?: string }>;
  loginClient(input: ClientLoginInput): Promise<{ user: AuthUser; token: string }>;
  loginOwner(input: OwnerLoginInput): Promise<{ user: AuthUser; token: string }>;
  logout(token: string): Promise<void>;
  validateToken(token: string): Promise<AuthUser>;
}

export interface IClientProfileRepository {
  createProfile(profile: {
    id: string;
    fullName: string;
    country: string;
    whatsappNumber?: string | null;
  }): Promise<ClientProfile>;
  getProfileById(id: string): Promise<ClientProfile | null>;
  updateProfile(id: string, data: UpdateClientProfileInput): Promise<ClientProfile>;
}

export interface IOwnerAccountRepository {
  getOwnerAccountByUserId(userId: string): Promise<OwnerAccount | null>;
  isUserActiveOwner(userId: string): Promise<boolean>;
  provisionOwnerAccount(userId: string): Promise<OwnerAccount>;
}
