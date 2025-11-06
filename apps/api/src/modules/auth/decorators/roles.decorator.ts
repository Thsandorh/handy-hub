import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@mesterpont/database';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
