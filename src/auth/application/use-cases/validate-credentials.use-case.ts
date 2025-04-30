import { Inject, UnauthorizedException } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { SERVICE_NAMES } from "src/auth/constants/service-names";
import { AuthPayload } from "src/auth/domain/entities/auth-payload";
import { IUserRepository } from "src/auth/domain/repositories/user-repository.interface";
import { IAuthMethodService } from "../ports/auth-method-service.interface";
import { AuthToken } from "src/auth/domain/objects/auth-token";

export class ValidateCredentialsUseCase {
    constructor(
        @Inject(SERVICE_NAMES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly moduleRef: ModuleRef,
    ) { }

    async execute(authToken: AuthToken): Promise<AuthPayload> {
        let authMethodService = this.moduleRef.get<IAuthMethodService>(authToken.method, { strict: false });
        let payload = authMethodService.validateUser(authToken.token);
        if (!payload) {
            throw new UnauthorizedException('Invalid token');
        }

        return payload;
    }
}