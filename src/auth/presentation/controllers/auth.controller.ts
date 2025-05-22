import { Controller, Post, Body, UseGuards, Req, Get, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { ProfileUseCase } from '../../application/use-cases/profile.use-case';
import { LoginDto } from '../dto/login.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { AuthPayload } from '../../domain/objects/auth-payload';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthMethodDto } from '../dto/auth-method.dto';
import { mapRegisterUserDtoToRegisterUserInput } from '../mappers/register-user.mapper';
import { map } from 'rxjs';
import { mapDtoToAuthMethod } from '../mappers/auth-method.mapper';
import { mapAuthTokenToDto } from '../mappers/auth_token.mapper';
import { AuthTokenDto } from '../dto/auth-token.dto';
import { mapProfileToDto } from '../mappers/profile.mapper';
import { ProfileDto } from '../dto/profile.dto';

@Controller('auth')
export class ControllerAuth {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly profileUseCase: ProfileUseCase,
  ) {}

  @Post('login')  
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthTokenDto })
  @ApiResponse({ status: 400, description: 'Invalid login credentials' })
  async login(@Body() authMethodDto: AuthMethodDto): Promise<AuthTokenDto> {
    let authMethod = mapDtoToAuthMethod(authMethodDto);
    let authToken = await this.loginUseCase.execute(authMethod);
    let authTokenDto = mapAuthTokenToDto(authToken);
    return authTokenDto;
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully', type: Boolean })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  async register(@Body() registerDto: RegisterUserDto): Promise<boolean> {
    let input = mapRegisterUserDtoToRegisterUserInput(registerDto);
    return this.registerUseCase.execute(input);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })  
  async profile(@Req() request: Request): Promise<ProfileDto> {
    const payload = request['user'] as AuthPayload;    
    let profile = await this.profileUseCase.execute(payload.id);
    let out = mapProfileToDto(profile);
    return out;
  } 
}