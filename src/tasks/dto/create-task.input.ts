import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateTaskInput {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  @Field()
  description: string;

  @Field()
  status: string;

  @IsString()
  @Field()
  assignedTo: string;
}
