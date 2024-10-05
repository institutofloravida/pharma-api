import type { UnitMeasure } from '../../enterprise/entities/unitMeasure'

export interface UnitMeasureRepository {
  create(unitMeasure: UnitMeasure): Promise<void>

}
