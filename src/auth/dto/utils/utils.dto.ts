import { UnprocessableEntityException } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false, name: 'ValidateRegisterUser' })
export class ValidateRegisterUser implements ValidatorConstraintInterface {
  validate(_: any, args?: ValidationArguments): Promise<boolean> | boolean {
    const password: string = args.object['password'];
    const confirmPassword: string = args.object['confirmPassword'];

    if (password !== confirmPassword) {
      throw new UnprocessableEntityException(
        'password and confirmPassword must match',
      );
    }
    return true;
  }

  defaultMessage(_?: ValidationArguments): string {
    return JSON.stringify({ message: 'Validation failed' });
  }
}
