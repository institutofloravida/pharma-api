import type { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UnitsMeasureRepository } from '@/domain/pharma/application/repositories/units-measure-repository'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'

export class InMemoryUnitsMeasureRepository implements UnitsMeasureRepository {
  public items: UnitMeasure[] = []

  async create(unitMeasure: UnitMeasure) {
    this.items.push(unitMeasure)
  }

  async findByContent(content: string) {
    const unitMeasure = this.items.find(item => item.content.toLowerCase() === content.toLowerCase().trim())
    if (!unitMeasure) {
      return null
    }

    return unitMeasure
  }

  async findByAcronym(acronym: string) {
    const unitMeasure = this.items.find(item => item.acronym.toLowerCase() === acronym.toLowerCase().trim())
    if (!unitMeasure) {
      return null
    }

    return unitMeasure
  }

  async findMany({ page }: PaginationParams, content?: string): Promise<{
    unitsMeasure: UnitMeasure[]
    meta: Meta
  }> {
    const unitsMeasure = this.items

    const unitsMeasureFiltered = unitsMeasure
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter(item => item.content.includes(content ?? ''))

    const unitsMeasurePaginated = unitsMeasureFiltered
      .slice((page - 1) * 20, page * 20)

    return {
      unitsMeasure: unitsMeasurePaginated,
      meta: {
        page,
        totalCount: unitsMeasureFiltered.length,
      },
    }
  }
}
