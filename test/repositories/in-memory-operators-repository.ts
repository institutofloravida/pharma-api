import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'
import { OperatorWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/operator-with-institution'
import { InMemoryInstitutionsRepository } from './in-memory-institutions-repository'

export class InMemoryOperatorsRepository implements OperatorsRepository {
  public items: Operator[] = []

  constructor(
    private institutionsRepository: InMemoryInstitutionsRepository,
  ) {}

  async create(operator: Operator) {
    this.items.push(operator)
  }

  async findById(id: string): Promise<Operator | null> {
    const operator = this.items.find((item) => item.id.toString() === id)

    if (!operator) {
      return null
    }

    return operator
  }

  async findByEmail(email: string) {
    const operator = this.items.find((item) => item.email === email)

    if (operator) {
      return operator
    }

    return null
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{ operators: OperatorWithInstitution[]; meta: Meta }> {
    const filteredOperators = this.items
      .filter(item => item.name.includes(content ?? ''))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const paginatedOperators = filteredOperators.slice((page - 1) * 10, page * 10)

    const operatorsWithInstitutions = await Promise.all(
      paginatedOperators.map(async operator => {
        const institutions = await Promise.all(
          operator.institutionsIds.map(async institutionId => {
            const institution = await this.institutionsRepository.findById(institutionId.toString())

            if (!institution) {
              throw new Error(`Institution with ID ${institutionId} does not exist.`)
            }

            return {
              id: institution.id,
              name: institution.content,
            }
          }),
        )

        return OperatorWithInstitution.create({
          id: operator.id,
          email: operator.email,
          name: operator.name,
          role: operator.role,
          createdAt: operator.createdAt,
          updatedAt: operator.updatedAt,
          institutions,
        })
      }),
    )

    return {
      operators: operatorsWithInstitutions,
      meta: {
        page,
        totalCount: filteredOperators.length,
      },
    }
  }
}
