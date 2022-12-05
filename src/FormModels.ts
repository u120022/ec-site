export interface RegisterFormModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormModel {
  email: string;
  password: string;
}

export interface CommentFormModel {
  body: string;
}

export interface UserNameFormModel {
  name: string;
}

export interface UserEmailFormModel {
  email: string;
}

export interface UserPasswordFormModel {
  password: string;
  confirmPassword: string;
}
