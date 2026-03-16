import { ZodError } from 'zod';
declare global {
  type ZodValidationError = ZodError;
}
