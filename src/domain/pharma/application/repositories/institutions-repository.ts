import { PaginationParams } from '@/core/repositories/pagination-params'
import { Institution } from '../../enterprise/entities/institution'
import { Meta } from '@/core/repositories/meta'

export abstract class InstitutionsRepository {
  abstract create(institution: Institution): Promise<void>
  abstract save(institution: Institution): Promise<void>
  abstract findById(id: string): Promise<Institution | null>
  abstract findByContent(content: string): Promise<Institution | null>
  abstract findByCnpj(cnpj: string): Promise<Institution | null>
  abstract findMany(
    params: PaginationParams,
    filters: { content?: string, cnpj?: string },
    operatorId: string,
    isSuper?: boolean
  ): Promise<{ institutions: Institution[]; meta: Meta }>
}
