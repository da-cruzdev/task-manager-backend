import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignupInput } from './dto/signup.input';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

import * as argon from 'argon2';
import { SigninInput } from './dto/signin.input';
import { User } from '@prisma/client';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
  ) {}

  async signup(signupInput: SignupInput) {
    const user = await this.userService.create(signupInput);

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.email,
    );

    await this.tokenService.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async signin({ email, password }: SigninInput) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'email ${email} introuvable`,
      );
    }

    const isPasswordVerify = await argon.verify(user.password, password);

    if (!isPasswordVerify) {
      throw new BadRequestException(`Le mot de passe est incorrect`);
    }

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.email,
    );

    await this.tokenService.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: { not: null },
      },
      data: { refreshToken: null },
    });

    return { loggedOut: true };
  }

  async getNewTokens(userId: number, refreshTokenOld: User) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException(`Accès ,l'utilisateur est introuvable`);
    }

    const tokenMatch = await argon.verify(
      user.refreshToken,
      refreshTokenOld.refreshToken,
    );

    if (!tokenMatch) {
      throw new ForbiddenException(
        `Accès interdit, le refreshToken est incorrect`,
      );
    }

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.email,
    );
    await this.tokenService.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }
}
