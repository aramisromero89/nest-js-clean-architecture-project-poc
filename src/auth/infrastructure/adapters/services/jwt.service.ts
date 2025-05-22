import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthPayload } from '../../../domain/objects/auth-payload';
import { ITokenService } from '../../ports/token-service.interface';

@Injectable()
export class JwtService implements ITokenService { 

  async generateToken(payload: any): Promise<string> {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return token;;
  }

  async validateToken(token: string): Promise<AuthPayload> {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);      
      return payload as AuthPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 