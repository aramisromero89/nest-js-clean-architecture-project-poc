import { RegisterUserInput } from "src/auth/application/dtos/register-user.input";
import { RegisterUserDto } from "../dto/register-user.dto";

export function mapRegisterUserDtoToRegisterUserInput(registerUserDto: RegisterUserDto): RegisterUserInput {
    return {
        email: registerUserDto.email,
        name: registerUserDto.name,
        surname: registerUserDto.surname,
        authMethod: {
            type: registerUserDto.authMethod.type,
            data: registerUserDto.authMethod.data,
        },
    };
}