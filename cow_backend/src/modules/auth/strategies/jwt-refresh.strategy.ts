import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserRepository } from '../../../repositories/user.repository';
import { AuthConstants } from '../constants/auth.constants';

interface RequestWithBody extends Request {
  body: { refreshToken: string };
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: AuthConstants.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestWithBody,
    payload: { sub: string; email: string },
  ) {
    const refreshToken: string = req.body.refreshToken;
    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token não corresponde');
    }

    return {
      id: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}
