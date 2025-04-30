import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
    @ApiProperty({ description: 'The authentication token issued to the user.' })
    token: string;

    @ApiProperty({ description: 'The method used for authentication, e.g., password, Google, etc.' })
    method: string;

    @ApiProperty({ description: 'The expiration date of the token, if applicable.', required: false })
    expiration?: Date;
}