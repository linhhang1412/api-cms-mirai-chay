import { SetMetadata } from '@nestjs/common';
import { AuthConstants } from './auth.messages';

export const ROLES_KEY = AuthConstants.ROLES_KEY;
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
