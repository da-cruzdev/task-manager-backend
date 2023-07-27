import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  assignedTo: string;

  @Field({ defaultValue: new Date() })
  deadline: Date;
}
