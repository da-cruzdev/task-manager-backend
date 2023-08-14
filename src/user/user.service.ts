import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from './entities/user.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersFilterOptions } from './dto/users-filter.dto';
import { PaginationOptions } from 'src/tasks/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { getUsersByFilter } from 'src/common/utils/functions';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const { username, email, password } = createUserInput;
      const hashedPassword = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Cet email est déjà utilisé`);
      }
    }
  }

  async findAll(
    filterOptions?: UsersFilterOptions,
    paginationOptions?: PaginationOptions,
  ) {
    const whereClause: Prisma.UserWhereInput = {
      ...getUsersByFilter(filterOptions),
    };

    const total = await this.prisma.user.count({ where: whereClause });

    const { skip, take } = paginationOptions;

    const users = await this.prisma.user.findMany({
      where: whereClause,
      orderBy: { createAt: 'desc' },
      take,
      skip,
    });

    return { data: users, totalCount: total };
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(
        `Utilisateur introuvable, email incorrect!!!`,
      );
    }
    return user;
  }

  async updateUserInfos({ id }: User, data: UpdateUserInput) {
    const { newPassword, oldPassword, ...otherData } = data;

    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    let updatedUser;

    if (!user) {
      throw new NotFoundException(`L'utilisateur  introuvable`);
    }

    updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...otherData,
      },
    });

    if (oldPassword) {
      const isCorrectPassword = await argon.verify(user.password, oldPassword);

      if (!isCorrectPassword) {
        throw new BadRequestException(`L'ancien mot de passe est incorrect`);
      }
      if (newPassword === '' || !newPassword) {
        throw new BadRequestException(
          `Veuillez entrer le nouveau mot de passe`,
        );
      } else {
        const hashedNewPassword = await argon.hash(newPassword);
        updatedUser = await this.prisma.user.update({
          where: { id },
          data: {
            password: hashedNewPassword,
          },
        });
      }
    }

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      updatedUser.id,
      updatedUser.email,
    );

    await this.tokenService.updateRefreshToken(updatedUser.id, refreshToken);

    return { updatedUser, accessToken, refreshToken };
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getUserInfo(user: User) {
    const userInfo = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!userInfo) {
      throw new NotFoundException(
        `Utilisateur introuvable, email incorrect!!!`,
      );
    }
    return userInfo;
  }

  async getUserCreatedTasks(id: number) {
    return this.prisma.user
      .findUnique({
        where: { id },
      })
      .createdtasks();
  }

  async getUserAssignedTasks(id: number) {
    return this.prisma.user
      .findUnique({
        where: { id },
      })
      .assignedTasks();
  }
}
