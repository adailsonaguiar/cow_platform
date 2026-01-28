export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface RefreshTokenUser {
  id: string;
  email: string;
  refreshToken: string;
}

export interface RefreshTokenRequest extends Request {
  user: RefreshTokenUser;
}
