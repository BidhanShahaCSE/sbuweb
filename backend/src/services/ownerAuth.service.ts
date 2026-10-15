import { IAuthRepository, IOwnerAccountRepository } from '../repositories/interfaces.js';
import { OwnerLoginInput } from '../schemas/auth.schemas.js';
import { ForbiddenError, NotFoundError } from '../errors/appError.js';

export class OwnerAuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly ownerRepository: IOwnerAccountRepository
  ) {}

  async login(input: OwnerLoginInput) {
    // 1. Authenticate credentials with auth provider
    const authResult = await this.authRepository.loginOwner(input);

    // 2. Server-side strict authorization check: Must exist in owner_accounts table and be active
    const isActive = await this.ownerRepository.isUserActiveOwner(authResult.user.id);
    if (!isActive) {
      throw new ForbiddenError('Unauthorized: Account does not possess active owner privileges.');
    }

    return {
      user: {
        ...authResult.user,
        role: 'owner' as const,
      },
      token: authResult.token,
    };
  }

  async getOwnerMe(userId: string) {
    const ownerAccount = await this.ownerRepository.getOwnerAccountByUserId(userId);
    if (!ownerAccount || !ownerAccount.isActive) {
      throw new NotFoundError('Owner account not found or is currently inactive.');
    }

    return {
      userId: ownerAccount.userId,
      isActive: ownerAccount.isActive,
      createdAt: ownerAccount.createdAt,
      role: 'owner' as const,
    };
  }
}
