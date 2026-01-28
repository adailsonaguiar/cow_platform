import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../../repositories/user.repository';
import { User, UserSchema } from '../../entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthConstants } from './constants/auth.constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: AuthConstants.JWT_SECRET,
      signOptions: { expiresIn: AuthConstants.JWT_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, UserRepository, JwtModule],
})
export class AuthModule {}
