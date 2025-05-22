import { AuthMethodInput } from "./auth-method.input";

export class RegisterUserInput {
    email: string;
    name: string;
    surname: string;
    profilePicture?: string;
    authMethod: AuthMethodInput;
}