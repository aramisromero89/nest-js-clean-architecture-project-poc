import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthMethodDto } from './auth-method.dto';

export class RegisterUserDto {    
    @ApiProperty({ description: 'The email of the user' })
    @IsString()
    email: string;    

    @ApiProperty({ description: 'The name of the user' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'The surname of the user' })
    @IsString()
    surname: string;

    @ApiProperty({ description: 'The profile picture url' })
    @IsString()
    @IsOptional()
    profilePicture?: string;

    @ApiProperty({ description: 'The authentication method of the user', type: AuthMethodDto })
    authMethod: AuthMethodDto;
}
