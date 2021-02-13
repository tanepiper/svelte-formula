export type FormEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface FormError {
  valid: boolean;
  invalid: boolean;
  message: string;
  errors: { [key: string]: boolean };
}

export type FormValues = Record<string, string>;

export type FormErrors = Record<string, FormError>;
