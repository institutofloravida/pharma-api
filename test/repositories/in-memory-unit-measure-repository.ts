import type { UnitMeasureRepository } from '@/domain/pharma/application/repositories/unit-measure-repository'
import type { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'

export class InMemoryUnitMeasureRepository implements UnitMeasureRepository {
  public items: UnitMeasure[] = []

  async create(unitMeasure: UnitMeasure) {
    this.items.push(unitMeasure)
  }
}
