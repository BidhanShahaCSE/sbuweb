import { IClientProfileRepository } from '../repositories/interfaces.js';
import { UpdateClientProfileInput } from '../schemas/auth.schemas.js';
import { NotFoundError } from '../errors/appError.js';

export class ClientProfileService {
  constructor(private readonly profileRepository: IClientProfileRepository) {}

  async getProfile(userId: string) {
    const profile = await this.profileRepository.getProfileById(userId);
    if (!profile) {
      throw new NotFoundError('Client profile does not exist.');
    }
    return profile;
  }

  async updateProfile(userId: string, data: UpdateClientProfileInput) {
    const existing = await this.profileRepository.getProfileById(userId);
    if (!existing) {
      throw new NotFoundError('Client profile does not exist.');
    }
    const updated = await this.profileRepository.updateProfile(userId, data);
    return updated;
  }
}
