export type UserRole = 'client' | 'owner';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface ClientProfile {
  id: string;
  fullName: string;
  country: string;
  whatsappNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OwnerAccount {
  userId: string;
  isActive: boolean;
  createdAt: Date;
}

// Augment Express Request to support authenticated user payload
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
