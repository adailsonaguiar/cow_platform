import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { RefreshTokenUser } from '../interfaces/auth.interface';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = RefreshTokenUser>(
    err: Error | null,
    user: TUser | false,
    _info: unknown,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Refresh token inválido ou expirado');
    }
    return user;
  }
}
