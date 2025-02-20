import { PaginationParams } from '@/core/repositories/pagination-params'
import { TherapeuticClass } from '../../enterprise/entities/therapeutic-class'
import { Meta } from '@/core/repositories/meta'

export abstract class TherapeuticClassesRepository {
  abstract create(therapeuticClass: TherapeuticClass): Promise<void>
  abstract save(
    therapeuticClass: TherapeuticClass,
  ): Promise<void>
  abstract findById(id: string): Promise<TherapeuticClass | null>
  abstract findByContent(content: string): Promise<TherapeuticClass | null>
  abstract findMany(
    params: PaginationParams,
    filters: { content?: string },
  ): Promise<{ therapeuticClasses: TherapeuticClass[]; meta: Meta }>
}
