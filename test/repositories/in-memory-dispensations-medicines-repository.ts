import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'

export class InMemoryDispensationsMedicinesRepository
implements DispensationsMedicinesRepository {
  public items: Dispensation[] = []
  async create(dispensation: Dispensation) {
    this.items.push(dispensation)
  }

  async findMany(
    { page }: PaginationParams,
    filters: { patientId?: string },
  ): Promise<{ dispensations: Dispensation[]; meta: Meta }> {
    const { patientId } = filters
    const dispensations = this.items

    const dispensationsFiltered = dispensations.filter(dispensation => {
      if (patientId) {
        return dispensation.patientId.equal(new UniqueEntityId(patientId))
      }
      return true
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const dispensationsPaginated = dispensationsFiltered
      .slice((page - 1) * 10, page * 10)

    return {
      dispensations: dispensationsPaginated,
      meta: {
        page,
        totalCount: dispensationsFiltered.length,
      },
    }
  }
}
