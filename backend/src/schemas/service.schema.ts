import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    price: z.number().positive('O preço deve ser maior que zero'),
    duration: z.number().positive('A duração deve ser maior que zero'),
  }),
});

export const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
    description: z.string().optional(),
    price: z.number().positive('O preço deve ser maior que zero').optional(),
    duration: z.number().positive('A duração deve ser maior que zero').optional(),
  }),
}); 