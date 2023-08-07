import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokensService } from 'src/tokens/tokens.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    UserResolver,
    UserService,
    PrismaService,
    TokensService,
    JwtService,
  ],
})
export class UserModule {}
