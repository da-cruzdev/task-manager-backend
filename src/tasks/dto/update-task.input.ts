import { TaskStatus } from '@prisma/client';
import { CreateTaskInput } from './create-task.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  @Field()
  status?: TaskStatus;
}
