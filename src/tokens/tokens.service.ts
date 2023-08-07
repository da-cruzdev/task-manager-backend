import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwt.sign(
      { userId, email },
      {
        expiresIn: '24h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = this.jwt.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '3d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
