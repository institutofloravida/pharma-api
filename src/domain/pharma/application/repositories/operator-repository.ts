import type { Operator } from '../../enterprise/entities/operator'

export interface OperatorRepository {
  create(operator: Operator): Promise<void>
  findByEmail(email: string): Promise<Operator | null>
}
