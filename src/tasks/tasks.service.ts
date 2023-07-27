import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from 'src/prisma/prisma.service';

import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTaskInput: CreateTaskInput, user: User) {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskInput.title,
        description: createTaskInput.description,
        status: createTaskInput.status,
        assignedTo: createTaskInput.assignedTo,
        user: { connect: { id: user.id } },
      },
    });

    return task;
  }

  async findAll() {
    return await this.prisma.task.findMany();
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      throw new NotFoundException(`La tâche avec l'id ${id} n'existe pas`);
    }

    return task;
  }

  async update(id: number, updateTaskInput: UpdateTaskInput) {
    const udateTask = await this.prisma.task.update({
      where: { id },
      data: { ...updateTaskInput },
    });
    if (!udateTask) {
      throw new NotFoundException(`La tâche avec l'id ${id} n'existe pas`);
    }

    return udateTask;
  }

  async remove(id: number) {
    return await this.prisma.task.delete({
      where: { id },
    });
  }
}
