import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TokensService, JwtService, PrismaService],
})
export class TokensModule {}
