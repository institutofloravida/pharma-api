import { PaginationParams } from '@/core/repositories/pagination-params'
import { Institution } from '../../enterprise/entities/institution'

export abstract class InstitutionsRepository {
  abstract create(institution: Institution): Promise<void>
  abstract findByContent(content: string): Promise<Institution | null>
  abstract findByCnpj(cnpj: string): Promise<Institution | null>
  abstract findMany(params: PaginationParams): Promise<Institution[]>
}
