import { Institution } from '@/domain/pharma/enterprise/entities/institution'

export class InstitutionPresenter {
  static toHTTP(institution: Institution) {
    return {
      id: institution.id.toString(),
      name: institution.content,
      cnpj: institution.cnpj,
      description: institution.description,
      createdAt: institution.createdAt,
      updatedAt: institution.updatedAt,
    }
  }
}
