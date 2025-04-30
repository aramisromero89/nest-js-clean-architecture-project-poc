import { Inject, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { SERVICE_NAMES } from 'src/auth/constants/service-names';
import { ProfileOutput } from '../dtos/profile.output';
import { map } from 'rxjs';
import { mapUserToProfileOutput } from '../mappers/user-profile.map';

export class ProfileUseCase {
  constructor(   
    @Inject(SERVICE_NAMES.USER_REPOSITORY) private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: number): Promise<ProfileOutput> {    
    let user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return mapUserToProfileOutput(user);
  }
} 