import { PaginationParams } from '@/core/repositories/pagination-params'
import { PharmaceuticalForm } from '../../enterprise/entities/pharmaceutical-form'
import type { Meta } from '@/core/repositories/meta'

export abstract class PharmaceuticalFormsRepository {
  abstract create(pharmaceuticalForm: PharmaceuticalForm): Promise<void>
  abstract findByContent(content: string): Promise<PharmaceuticalForm | null>
  abstract findMany(params: PaginationParams, content?: string): Promise<{
    pharmaceuticalForms: PharmaceuticalForm[]
    meta: Meta
  }>
}
