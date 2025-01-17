import { PaginationParams } from '@/core/repositories/pagination-params'
import { Pathology } from '../../enterprise/entities/pathology'
import type { Meta } from '@/core/repositories/meta'

export abstract class PathologiesRepository {
  abstract create(pathology: Pathology): Promise<void>
  abstract findById(id: string): Promise<Pathology | null>
  abstract findByContent(content: string): Promise<Pathology | null>
  abstract findMany(
    params: PaginationParams,
    content?: string
  ): Promise<{
    pathologies: Pathology[],
    meta: Meta
  }>
}
