import { AuthPayload } from "../../domain/objects/auth-payload";

export interface ITokenService {
  generateToken(payload: any):Promise<string>;
  validateToken(token: string): Promise<AuthPayload>;
} 
