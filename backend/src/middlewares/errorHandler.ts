import { Request, Response, NextFunction } from 'express';
import { AppError } from '../domain/errors/AppError';
import { ZodError } from 'zod';
import logger from '../config/logger';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Erro de validação',
      errors: error.errors,
    });
  }

  // Erro não tratado
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor',
  });
} 