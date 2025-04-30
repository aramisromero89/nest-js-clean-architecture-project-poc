import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'The username or email of the user' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  password: string;
}