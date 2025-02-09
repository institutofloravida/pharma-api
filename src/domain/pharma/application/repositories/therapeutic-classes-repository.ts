import { PaginationParams } from '@/core/repositories/pagination-params'
import { TherapeuticClass } from '../../enterprise/entities/therapeutic-class'
import type { Meta } from '@/core/repositories/meta'

export abstract class TherapeuticClassesRepository {
  abstract create(therapeuticClass: TherapeuticClass): Promise<void>
  abstract findByContent(content: string): Promise<TherapeuticClass | null>
  abstract findMany(
    params: PaginationParams,
    filters: { content?: string },
  ): Promise<{ therapeuticClasses: TherapeuticClass[]; meta: Meta }>
}
