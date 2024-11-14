import { PaginationParams } from '@/core/repositories/pagination-params'
import { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'

export class InMemoryOperatorsRepository implements OperatorsRepository {
  public items: Operator[] = []

  async create(operator: Operator) {
    this.items.push(operator)
  }

  async findById(id: string): Promise<Operator | null> {
    const operator = this.items.find(item => item.id.toString() === id)

    if (!operator) {
      return null
    }

    return operator
  }

  async findByEmail(email: string) {
    const operator = this.items.find(item => item.email === email)

    if (operator) {
      return operator
    }

    return null
  }

  async findMany({ page }: PaginationParams): Promise<Operator[]> {
    const operators = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return operators
  }
}
