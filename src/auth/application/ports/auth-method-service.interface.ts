import { AuthMethod } from "src/auth/domain/entities/auth-method";
import { User } from "src/auth/domain/entities/user";
import { RegisterUserInput } from "../dtos/register-user.input";
import { AuthPayload } from "src/auth/domain/entities/auth-payload";
import { AuthToken } from "src/auth/domain/objects/auth-token";

export interface IAuthMethodService {
    validateUser(authToken: string): Promise<AuthPayload>;
    createMethod(createUserInput: RegisterUserInput): Promise<AuthMethod>;
    login(loginData: any): Promise<AuthToken>;
}