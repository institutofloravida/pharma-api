import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UnitsMeasureRepository } from '@/domain/pharma/application/repositories/units-measure-repository'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'

export class InMemoryUnitsMeasureRepository implements UnitsMeasureRepository {
  public items: UnitMeasure[] = []

  async create(unitMeasure: UnitMeasure) {
    this.items.push(unitMeasure)
  }

  async save(unitMeasure: UnitMeasure): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equal(unitMeasure.id),
    )

    this.items[itemIndex] = unitMeasure
  }

  async findById(id: string): Promise<UnitMeasure | null> {
    const unitMeasure = this.items.find((unitMeasure) =>
      unitMeasure.id.equal(new UniqueEntityId(id)),
    )

    if (!unitMeasure) return null

    return unitMeasure
  }

  async findByContent(content: string) {
    const unitMeasure = this.items.find(
      (item) => item.content.toLowerCase() === content.toLowerCase().trim(),
    )
    if (!unitMeasure) {
      return null
    }

    return unitMeasure
  }

  async findByAcronym(acronym: string) {
    const unitMeasure = this.items.find(
      (item) => item.acronym.toLowerCase() === acronym.toLowerCase().trim(),
    )
    if (!unitMeasure) {
      return null
    }

    return unitMeasure
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{
    unitsMeasure: UnitMeasure[];
    meta: Meta;
  }> {
    const unitsMeasure = this.items

    const unitsMeasureFiltered = unitsMeasure
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter((item) => item.content.includes(content ?? ''))

    const unitsMeasurePaginated = unitsMeasureFiltered.slice(
      (page - 1) * 10,
      page * 10,
    )

    return {
      unitsMeasure: unitsMeasurePaginated,
      meta: {
        page,
        totalCount: unitsMeasureFiltered.length,
      },
    }
  }
}
