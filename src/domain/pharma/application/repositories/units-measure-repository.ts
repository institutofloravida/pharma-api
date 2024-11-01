import { UnitMeasure } from '../../enterprise/entities/unitMeasure'

export abstract class UnitsMeasureRepository {
  abstract create(unitMeasure: UnitMeasure): Promise<void>
  abstract findByContent(content: string): Promise<UnitMeasure | null>
  abstract findByAcronym(acronym: string): Promise<UnitMeasure | null>
}
