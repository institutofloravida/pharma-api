import { PaginationParams } from '@/core/repositories/pagination-params'
import { Operator } from '../../enterprise/entities/operator'
import { Meta } from '@/core/repositories/meta'
import { OperatorWithInstitution } from '../../enterprise/entities/value-objects/operator-with-institution'

export abstract class OperatorsRepository {
  abstract create(operator: Operator): Promise<void>
  abstract save(operator: Operator): Promise<void>
  abstract findById(id: string): Promise<Operator | null>
  abstract findByEmail(email: string): Promise<Operator | null>
  abstract findMany(
    params: PaginationParams,
    content?: string,
  ): Promise<{ operators: OperatorWithInstitution[]; meta: Meta }>
}
