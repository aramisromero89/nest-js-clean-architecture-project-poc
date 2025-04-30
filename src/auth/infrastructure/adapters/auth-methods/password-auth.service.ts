import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserInput } from 'src/auth/application/dtos/register-user.input';
import { IAuthMethodService } from 'src/auth/application/ports/auth-method-service.interface';
import { AUTH_METHODS } from 'src/auth/constants/auth-methods';
import { SERVICE_NAMES } from 'src/auth/constants/service-names';
import { AuthMethod } from 'src/auth/domain/entities/auth-method';
import { AuthPayload } from 'src/auth/domain/entities/auth-payload';
import { IUserRepository } from 'src/auth/domain/repositories/user-repository.interface';
import { IHashService } from 'src/auth/infrastructure/ports/hash-service.interface';
import { ITokenService } from '../../ports/token-service.interface';
import { AuthToken } from 'src/auth/domain/objects/auth-token';

@Injectable()
export class PasswordAuthMethodService implements IAuthMethodService {
    constructor(
        @Inject(SERVICE_NAMES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
        @Inject(SERVICE_NAMES.HASH_SERVICE) private readonly hashService: IHashService,
        @Inject(SERVICE_NAMES.TOKEN_SERVICE) private readonly tokenService: ITokenService,
    ) { }


    async validateUser(authToken: string): Promise<AuthPayload> {
        //decode token using token service
        const payload = await this.tokenService.validateToken(authToken);
        if (!payload) {
            throw new Error('Invalid token');
        }        
        const user = await this.userRepository.findById(payload.id);
        if (!user) {
            throw new Error('Invalid token');
        }        
        return payload;

    }



    async createMethod(createUserInput: RegisterUserInput): Promise<AuthMethod> {
        const hashedPassword = await this.hashService.hash(createUserInput.authMethod.data.password);
        const authMethod: AuthMethod = {
            type: AUTH_METHODS.PASSWORD,
            data: {
                password: hashedPassword,
            },
        };
        return authMethod;
    }

    async login(loginData: any): Promise<AuthToken> {
        const user = await this.userRepository.findByEmail(loginData.email);
        if (!user) {
            throw new Error('User not found');
        }
        const passwordauthmethod = user.authMethods.find((method) => method.type === AUTH_METHODS.PASSWORD);
        if (!passwordauthmethod) {
            throw new Error('Password authentication method not found');
        }
        const isPasswordValid = await this.hashService.compare(loginData.password, passwordauthmethod.data.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const payload: AuthPayload = {
            id: user.id,
            email: user.email,
        };
        const token = await this.tokenService.generateToken(payload);
        return {
            token: token,
            method: AUTH_METHODS.PASSWORD,
            expiration: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
        };
    }
}