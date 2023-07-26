export interface JwtPayload {
  email: string;
  userId: number;
}

export interface JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
