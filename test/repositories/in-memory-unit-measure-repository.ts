import type { UnitMeasureRepository } from '@/domain/pharma/application/repositories/unit-measure-repository'
import type { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'

export class InMemoryUnitMeasureRepository implements UnitMeasureRepository {
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
}
