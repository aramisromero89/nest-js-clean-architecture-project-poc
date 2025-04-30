import { AuthToken } from '../../domain/objects/auth-token.js';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { SERVICE_NAMES } from 'src/auth/constants/service-names';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { AuthMethodInput } from '../dtos/auth-method.input';
import { ModuleRef } from '@nestjs/core';
import { IAuthMethodService } from '../ports/auth-method-service.interface';
export class LoginUseCase {
  constructor(
    @Inject(SERVICE_NAMES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly moduleRef: ModuleRef,
  ) { }

  async execute(authMethodInput: AuthMethodInput): Promise<AuthToken> {
    let authMethodService = this.moduleRef.get<IAuthMethodService>(authMethodInput.type, { strict: false });
    let authToken: AuthToken;
    try {
      authToken = await authMethodService.login(authMethodInput.data);
    }
    catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return authToken;
  }
} 