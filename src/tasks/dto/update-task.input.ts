import { CreateTaskInput } from './create-task.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {}
