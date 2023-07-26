import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignupInput } from './dto/signup.input';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupInput: SignupInput) {
    const user = await this.userService.create(signupInput);
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async getNewTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ForbiddenException(`Accès interdit`);
    }

    const tokenMatch = await argon.verify(user.refreshToken, rt);

    if (!tokenMatch) {
      throw new ForbiddenException(`Accès interdit`);
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwt.sign(
      { userId, email },
      {
        expiresIn: '10m',
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
