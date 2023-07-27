import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from '@prisma/client';

@ObjectType()
export class Task {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  status: TaskStatus;

  @Field()
  assignedToId: number;

  @Field({ nullable: true })
  deadline: Date;
}
