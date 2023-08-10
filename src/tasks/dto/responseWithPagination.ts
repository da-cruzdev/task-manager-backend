import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Task } from '../entities/task.entity';

@ObjectType()
export class Pagination {
  @Field({ nullable: true })
  skip: number;

  @Field({ nullable: true })
  take: number;

  @Field({ nullable: true })
  total: number;
}
@ObjectType()
export class ResponseWithPagination {
  @Field(() => [Task], { nullable: true })
  data: Task[];

  @Field(() => Int, { nullable: true })
  totalCount: number;
}
