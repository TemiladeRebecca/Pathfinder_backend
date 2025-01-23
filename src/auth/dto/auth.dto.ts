export class RegisterUserSchema {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
}
export class LoginUserSchema {
  email: string;
  password: string;
}
