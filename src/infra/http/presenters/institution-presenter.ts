import { Institution } from '@/domain/pharma/enterprise/entities/institution'

export class InstitutionPresenter {
  static toHTTP(institution: Institution) {
    return {
      id: institution.id.toString(),
      name: institution.content,
      cnpj: institution.cnpj,
      controlStock: institution.controlStock,
      responsible: institution.responsible,
      type: institution.type,
      description: institution.description
        ? institution.description.length > 100
          ? `${institution.description.substring(0, 100)}...`
          : institution.description
        : null,
      createdAt: institution.createdAt,
      updatedAt: institution.updatedAt,
    }
  }
}
