import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthConstants } from './constants/auth.constants';
import { UserDocument } from '../../entities/user.entity';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<TokenResponse> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = this.generateTokens(user);
    await this.userRepository.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<TokenResponse> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário desativado');
    }

    const tokens = this.generateTokens(user);
    await this.userRepository.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokenResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Acesso negado');
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const tokens = this.generateTokens(user);
    await this.userRepository.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userDoc = user as UserDocument & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }

  private generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: AuthConstants.JWT_SECRET,
      expiresIn: AuthConstants.JWT_EXPIRATION,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: AuthConstants.JWT_REFRESH_SECRET,
      expiresIn: AuthConstants.JWT_REFRESH_EXPIRATION,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
