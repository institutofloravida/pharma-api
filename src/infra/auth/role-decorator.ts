import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: OperatorRole[]) => SetMetadata(ROLES_KEY, roles)
