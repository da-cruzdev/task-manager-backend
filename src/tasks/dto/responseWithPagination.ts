import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Task } from '../entities/task.entity';

@ObjectType()
export class ResponseWithPagination {
  @Field(() => [Task], { nullable: true })
  data: Task[];

  @Field(() => Int, { nullable: true })
  totalCount: number;
}
