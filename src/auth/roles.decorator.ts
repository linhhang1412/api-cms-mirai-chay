import { SetMetadata } from '@nestjs/common';
import { AuthConstants } from './constants';

export const ROLES_KEY = AuthConstants.SECURITY.ROLES_METADATA_KEY;
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
