import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ValidateCredentialsUseCase } from 'src/auth/application/use-cases/validate-credentials.use-case';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    //inject validate use case
    private readonly validateUseCase: ValidateCredentialsUseCase,    
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    //get the token from the request header
    const token: string = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      return false;
    }
    //get the auth method from the request header
    const authMethod:string = request.headers['auth-method'];
    if (!authMethod) {
      return false;
    }
    //validate the token using the validate use case
    const payload = await this.validateUseCase.execute({
      method: authMethod,
      token,
    });
    if (!payload) {
      return false;
    }
    //set the user in the request object
    request.user = payload;    
    return true;
  }
} 