import { PaginationParams } from '@/core/repositories/pagination-params'
import { MovementType, type MovementDirection } from '../../enterprise/entities/movement-type'
import { Meta } from '@/core/repositories/meta'

export abstract class MovementTypesRepository {
  abstract create(movementType: MovementType): Promise<void>
  abstract findByContent(content:string): Promise<MovementType | null>
  abstract findMany(params: PaginationParams, filters: {
    content?: string
    direction?: MovementDirection
  }): Promise<{ movementTypes: MovementType[], meta: Meta }>
}
