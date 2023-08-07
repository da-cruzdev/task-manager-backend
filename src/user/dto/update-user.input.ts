import { IsString } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsPasswordValid } from 'src/common/utils/validators';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsString()
  @IsPasswordValid('password', {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Field()
  oldPassword?: string;

  @IsString()
  @IsPasswordValid('password', {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Field()
  newPassword?: string;
}
