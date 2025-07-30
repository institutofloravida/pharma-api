import { PaginationParams } from '@/core/repositories/pagination-params'
import { UnitMeasure } from '../../enterprise/entities/unitMeasure'
import { Meta } from '@/core/repositories/meta'

export abstract class UnitsMeasureRepository {
  abstract create(unitMeasure: UnitMeasure): Promise<void>
  abstract save(unitMeasure: UnitMeasure): Promise<void>
  abstract findById(id: string): Promise<UnitMeasure | null>
  abstract findByContent(content: string): Promise<UnitMeasure | null>
  abstract findByAcronym(acronym: string): Promise<UnitMeasure | null>
  abstract findMany(params: PaginationParams, content?: string): Promise<{
    unitsMeasure: UnitMeasure[]
    meta: Meta
  }>
  abstract delete(unitMeasureId: string): Promise<void>
}
