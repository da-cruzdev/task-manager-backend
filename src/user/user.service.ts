import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll() {
    return await this.prisma.user.findMany();
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

  async update(id: number, updateUserInput: UpdateUserInput) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserInput,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur introuvable`);
    }

    return updatedUser;
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
