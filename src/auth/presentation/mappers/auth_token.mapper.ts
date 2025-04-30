import { AuthToken } from "src/auth/domain/objects/auth-token";
import { AuthTokenDto } from "../dto/auth-token.dto";

export function mapAuthTokenToDto(authToken: AuthToken): AuthTokenDto {
  return {
    token: authToken.token,
    method: authToken.method,
    expiration: authToken.expiration
  };
}

export function mapDtoToAuthToken(authTokenDto: AuthTokenDto): AuthToken {
  return {
    token: authTokenDto.token,
    method: authTokenDto.method,
    expiration: authTokenDto.expiration
  };
}