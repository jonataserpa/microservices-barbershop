import { z } from 'zod';
import { UserRole } from '../domain/entities/User';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    role: z.enum([UserRole.CUSTOMER, UserRole.BARBER]).optional(),
    birthDate: z.string().transform((str) => new Date(str)).optional(),
    hasAllergy: z.boolean().optional(),
    specialty: z.string().optional(),
  }),
}); 