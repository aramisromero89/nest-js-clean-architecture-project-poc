import { HttpException, HttpStatus } from "@nestjs/common";
import { User } from "src/auth/domain/entities/user";

export class SocialUserNotRegisteredException extends HttpException {    
  constructor(public readonly user: User) {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}