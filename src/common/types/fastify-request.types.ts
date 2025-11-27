import { FastifyRequest } from 'fastify';
import { User } from '../../users/entities/user.entity';
export interface AuthenticatedUser {
  userId: string;
  // Add other user properties as needed
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: AuthenticatedUser;
}

// This type can be used with @Request() decorator in controllers
export type NestifyRequest<T = unknown> = T & {
  user: AuthenticatedUser;
};

export interface LocalAuthenticatedRequest extends FastifyRequest {
  user: User;
}
