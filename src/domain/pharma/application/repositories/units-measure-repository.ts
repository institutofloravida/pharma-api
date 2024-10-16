import type { UnitMeasure } from '../../enterprise/entities/unitMeasure'

export interface UnitsMeasureRepository {
  create(unitMeasure: UnitMeasure): Promise<void>
  findByContent(content: string): Promise<UnitMeasure | null>
  findByAcronym(acronym: string): Promise<UnitMeasure | null>
}
