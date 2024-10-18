import type { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'
import type { Operator } from '@/domain/pharma/enterprise/entities/operator'

export class InMemoryOperatorsRepository implements OperatorsRepository {
  public items: Operator[] = []

  async create(operator: Operator) {
    this.items.push(operator)
  }

  async findByEmail(email: string) {
    const operator = this.items.find(item => item.email === email)

    if (operator) {
      return operator
    }

    return null
  }
}
