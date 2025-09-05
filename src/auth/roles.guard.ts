import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthConstants } from './auth.messages';

interface Request {
  user?: {
    role: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(AuthConstants.ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const request: Request = context.switchToHttp().getRequest();
    
    if (!request.user || !request.user.role) {
      return false;
    }
    
    return requiredRoles.some((role) => request.user!.role === role);
  }
}
