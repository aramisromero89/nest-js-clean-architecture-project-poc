import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { RegisterUserInput } from 'src/auth/application/dtos/register-user.input';
import { IAuthMethodService } from 'src/auth/application/ports/auth-method-service.interface';
import { AUTH_METHODS } from 'src/auth/constants/auth-methods';
import { SERVICE_NAMES } from 'src/auth/constants/service-names';
import { AuthMethod } from 'src/auth/domain/entities/auth-method';
import { AuthPayload } from 'src/auth/domain/entities/auth-payload';
import { AuthToken } from 'src/auth/domain/objects/auth-token';
import { IUserRepository } from 'src/auth/domain/repositories/user-repository.interface';
import { ITokenService } from '../../ports/token-service.interface';

@Injectable()
export class GoogleAuthMethodService implements IAuthMethodService {
  constructor(
    @Inject(SERVICE_NAMES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(SERVICE_NAMES.TOKEN_SERVICE) private readonly tokenService: ITokenService,
  ) { }

  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  readonly googleIdentifier: string = "googleID";

  async validateUser(authToken: string): Promise<AuthPayload> {
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
    const ticket = await this.client.verifyIdToken({
      idToken: createUserInput.authMethod.data,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid Google token');
    const user = await this.userRepository.findByAuthMethodData(AUTH_METHODS.GOOGLE, this.googleIdentifier, payload.sub);
    if (user) throw new Error('User already exists');
    const authMethod: AuthMethod = {
      type: AUTH_METHODS.GOOGLE,
      data: {
        [this.googleIdentifier]: payload.sub,
      },
    };
    return authMethod;
  }

  async login(loginData: any): Promise<AuthToken> {
    const ticket = await this.client.verifyIdToken({
      idToken: loginData,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    //conver Unix time paylod exp to date
    const expirationDate = new Date(payload!.exp * 1000);
    if (!payload) throw new Error('Invalid Google token');
    const user = await this.userRepository.findByAuthMethodData(AUTH_METHODS.GOOGLE, this.googleIdentifier, payload.sub);
    if (!user) throw new Error('User not found');
    const outPayload: AuthPayload = {
      id: user.id,
      email: user.email,
    };
    const token = await this.tokenService.generateToken(outPayload);
    return {
      token: token,
      method: AUTH_METHODS.PASSWORD,
      expiration: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
    };
  }

} 