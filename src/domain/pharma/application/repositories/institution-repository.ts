import { Institution } from '../../enterprise/entities/institution'

export interface InstitutionRepository {
  create(institution: Institution): Promise<void>
  findByContent(content: string): Promise<Institution | null>
  findByCnpj(cnpj: string): Promise<Institution | null>
}
