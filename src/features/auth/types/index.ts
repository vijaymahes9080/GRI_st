import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(3, 'Username or Roll Number must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
