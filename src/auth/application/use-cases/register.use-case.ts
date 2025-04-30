
import { User } from '../../domain/entities/user';
import { BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { RegisterUserInput } from '../dtos/register-user.input';
import { AuthMethod } from 'src/auth/domain/entities/auth-method';
import { ModuleRef } from '@nestjs/core';
import { IAuthMethodService } from '../ports/auth-method-service.interface';
import { SERVICE_NAMES } from 'src/auth/constants/service-names';
export class RegisterUseCase {
  constructor(
    @Inject(SERVICE_NAMES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly moduleRef: ModuleRef,
  ) { }

  async execute(input: RegisterUserInput): Promise<boolean> {
    // Check if the user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    let authMethodService = this.moduleRef.get<IAuthMethodService>(input.authMethod.type, { strict: false });
    let authMethod: AuthMethod = await authMethodService.createMethod(input); 
    let user: User = {
      id: 0, // Assuming ID is auto-generated
      email: input.email,
      name: input.name,
      surname: input.surname,
      authMethods: [authMethod],
    }
    let res = await this.userRepository.save(user);
    return res !=null;
  }
} 