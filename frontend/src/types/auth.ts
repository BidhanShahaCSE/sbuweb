export type AuthMode = 'client-login' | 'client-register' | 'owner-login';

export interface ClientLoginFormData {
  email: string;
  password: string;
}

export interface ClientRegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  whatsappNumber: string;
}

export interface OwnerLoginFormData {
  email: string;
  password: string;
}

export interface FormValidationErrors {
  [key: string]: string | undefined;
}
