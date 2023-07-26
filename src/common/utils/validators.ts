import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class PasswordValidation implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: string, args?: ValidationArguments) {
    const regex = /^[A-Za-z0-9]{8,30}$/;

    const isValidPassword = regex.test(value);

    return isValidPassword ? true : false;
  }
}

@ValidatorConstraint({ async: true })
export class EmailValidation implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: string, args?: ValidationArguments) {
    const regex = /^[A-Za-z0-9_.-]+@[A-Za-z_-]+\.[A-Za-z_-]{2,4}$/;

    const isValidEmail = regex.test(value);

    return isValidEmail ? true : false;
  }
}

export function IsPasswordValid(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPasswordValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: PasswordValidation,
    });
  };
}

export function IsEmailValid(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPasswordValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: EmailValidation,
    });
  };
}
