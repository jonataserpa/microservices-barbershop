import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../domain/errors/AppError';
import { UserRole } from '../domain/entities/User';

interface TokenPayload {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token não fornecido');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret',
    ) as TokenPayload;

    req.user = decoded;

    return next();
  } catch {
    throw new UnauthorizedError('Token inválido');
  }
}

export function roleMiddleware(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Acesso não autorizado para este recurso');
    }

    return next();
  };
} 