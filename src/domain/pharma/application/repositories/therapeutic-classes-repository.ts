import { PaginationParams } from '@/core/repositories/pagination-params'
import { TherapeuticClass } from '../../enterprise/entities/therapeutic-class'

export abstract class TherapeuticClassesRepository {
  abstract create(therapeuticClass: TherapeuticClass): Promise<void>
  abstract findByContent(content: string): Promise<TherapeuticClass | null>
  abstract findMany(params: PaginationParams): Promise<TherapeuticClass[]>
}
