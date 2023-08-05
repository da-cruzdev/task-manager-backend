import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TaskStatus } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';

export enum TasksStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Statut de la tâche',
});

@ObjectType()
export class Task {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field()
  assignedToId: number;

  @Field({ nullable: true })
  deadline: Date;
}
