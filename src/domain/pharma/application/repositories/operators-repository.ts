import type { PaginationParams } from '@/core/repositories/pagination-params'
import { Operator } from '../../enterprise/entities/operator'

export abstract class OperatorsRepository {
  abstract create(operator: Operator): Promise<void>
  abstract findByEmail(email: string): Promise<Operator | null>
  abstract findMany(params: PaginationParams): Promise<Operator[]>
}
