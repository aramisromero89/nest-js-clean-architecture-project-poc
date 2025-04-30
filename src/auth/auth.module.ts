import { Module } from '@nestjs/common';
import { ControllerAuth } from './presentation/controllers/auth.controller';
import { JsonFileUserRepository } from './infrastructure/adapters/repositories/json-file-user.repository';
import { AuthGuard } from './presentation/guards/auth.guard';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { ProfileUseCase } from './application/use-cases/profile.use-case';
import { AUTH_METHODS } from './constants/auth-methods';
import { GoogleAuthMethodService } from './infrastructure/adapters/auth-methods/google-auth.service';
import { PasswordAuthMethodService } from './infrastructure/adapters/auth-methods/password-auth.service';
import { SERVICE_NAMES } from './constants/service-names';
import { BcryptHashService } from './infrastructure/adapters/services/bcrypt-hash.service';
import { JwtService } from './infrastructure/adapters/services/jwt.service';
import { ValidateCredentialsUseCase } from './application/use-cases/validate-credentials.use-case';

@Module({
  controllers: [ControllerAuth],
  providers: [
    AuthGuard,
    LoginUseCase,
    RegisterUseCase,
    ProfileUseCase,
    ValidateCredentialsUseCase,
    { provide: SERVICE_NAMES.TOKEN_SERVICE, useClass: JwtService },
    { provide: SERVICE_NAMES.HASH_SERVICE, useClass: BcryptHashService },
    { provide: AUTH_METHODS.GOOGLE, useClass: GoogleAuthMethodService },
    { provide: AUTH_METHODS.PASSWORD, useClass: PasswordAuthMethodService },
    { provide: SERVICE_NAMES.USER_REPOSITORY, useClass: JsonFileUserRepository }
  ],
})
export class AuthModule { }
