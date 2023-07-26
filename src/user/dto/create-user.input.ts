import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEmailValid, IsPasswordValid } from 'src/common/utils/validators';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @Field()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmailValid('email', {
    message: `L'email n'est pas valide`,
  })
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsPasswordValid('password', {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Field()
  password: string;
}
