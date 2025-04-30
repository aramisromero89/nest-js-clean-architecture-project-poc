import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
    @ApiProperty({ description: 'Unique identifier of the user' })
    id: number;

    @ApiProperty({ description: 'Email address of the user' })
    email: string;

    @ApiProperty({ description: 'First name of the user' })
    name: string;

    @ApiProperty({ description: 'Surname of the user' })
    surname: string;
}