import { AuthMethod } from "src/auth/domain/entities/auth-method";
import { AuthMethodDto } from "../dto/auth-method.dto";

export function mapAuthMethodToDto(authMethod: AuthMethod): AuthMethodDto {
  const authMethodDto = new AuthMethodDto();
  authMethodDto.type = authMethod.type;
  authMethodDto.data = authMethod.data;
  return authMethodDto;
}

export function mapDtoToAuthMethod(authMethodDto: AuthMethodDto): AuthMethod {
  const authMethod = new AuthMethod();
  authMethod.type = authMethodDto.type;
  authMethod.data = authMethodDto.data;
  return authMethod;
}