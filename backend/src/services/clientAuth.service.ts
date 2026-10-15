import { IAuthRepository, IClientProfileRepository } from '../repositories/interfaces.js';
import { ClientRegisterInput, ClientLoginInput } from '../schemas/auth.schemas.js';

export class ClientAuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly profileRepository: IClientProfileRepository
  ) {}

  async register(input: ClientRegisterInput) {
    // 1. Register with Auth provider (e.g., Supabase Auth)
    const authResult = await this.authRepository.registerClient(input);

    // 2. Persist client profile attached to auth.users.id
    const profile = await this.profileRepository.createProfile({
      id: authResult.user.id,
      fullName: input.fullName,
      country: input.country,
      whatsappNumber: input.whatsappNumber,
    });

    return {
      user: authResult.user,
      profile,
      token: authResult.token,
    };
  }

  async login(input: ClientLoginInput) {
    const authResult = await this.authRepository.loginClient(input);
    const profile = await this.profileRepository.getProfileById(authResult.user.id);

    return {
      user: authResult.user,
      profile,
      token: authResult.token,
    };
  }

  async logout(token: string): Promise<void> {
    await this.authRepository.logout(token);
  }
}
