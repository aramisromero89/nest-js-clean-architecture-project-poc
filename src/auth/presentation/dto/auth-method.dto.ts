import { ApiProperty } from '@nestjs/swagger';

export class AuthMethodDto {
    @ApiProperty({ description: 'The type of authentication method' })
    type: string;

    @ApiProperty({ description: 'Additional data for the authentication method', required: false })
    data?: any;
}