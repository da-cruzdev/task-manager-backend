import { Field, InputType } from '@nestjs/graphql';
import { TasksStatus } from 'src/common/enums/task-status.enum';

@InputType()
export class TasksFilterOptions {
  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  status?: TasksStatus;
}
