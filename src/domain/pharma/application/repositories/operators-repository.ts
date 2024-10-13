import type { Operator } from '../../enterprise/entities/operator'

export interface OperatorsRepository {
  create(operator: Operator): Promise<void>
  findByEmail(email: string): Promise<Operator | null>
}
