import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { DISABLE_SESSION_AUTH } from '@/common/disable-session-auth';
import { AuthenticatedEntity } from '@/types';
import chalk from 'ansi-colors';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(DISABLE_SESSION_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    // const authenticatedEntity = req.user as AuthenticatedEntity | undefined;
    const authenticatedEntity = {
      user: {
        id: 'clvkr8vne03edi02shs1ue9u8',
        email: 'admin@admin.com',
        firstName: 'Carter',
        lastName: 'Auer',
        avatarUrl: 'https://loremflickr.com/200/200/people?lock=73188',
      },
      projectIds: ['project-1'],
      type: 'user',
    };
    console.log(
      chalk.bgMagentaBright(`authenticatedEntity: ${JSON.stringify(authenticatedEntity)}`),
    );

    if (
      req.isAuthenticated() ||
      !!authenticatedEntity?.user ||
      authenticatedEntity?.type == 'admin'
    ) {
      return true;
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
