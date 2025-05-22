import { AuthToken } from '../../domain/objects/auth-token.js';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthMethodInput } from '../dtos/auth-method.input';
import { ModuleRef } from '@nestjs/core';
import { IAuthMethodService } from '../ports/auth-method-service.interface';
import { SocialUserNotRegisteredException } from '../exceptions/social-user-not-registered.exception';
import { RegisterUseCase } from './register.use-case';

@Injectable()
export class LoginUseCase {
  constructor(    
    private readonly moduleRef: ModuleRef,
    private readonly registerUserUseCase: RegisterUseCase,
  ) { }

  async execute(authMethodInput: AuthMethodInput): Promise<AuthToken> {
    let authMethodService = this.moduleRef.get<IAuthMethodService>(authMethodInput.type, { strict: false });
    let authToken: AuthToken;
    try {
      authToken = await authMethodService.login(authMethodInput.data);
    }
    catch (error) {
      if (error instanceof SocialUserNotRegisteredException) {
        this.registerUserUseCase.execute({
          email: error.user.email,
          name: error.user.name,
          profilePicture: error.user.profilePicture,
          authMethod: error.user.authMethods[0],
          surname: error.user.surname,
        })
        authToken = await authMethodService.login(authMethodInput.data);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    return authToken;
  }
} 