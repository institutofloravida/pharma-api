import { OperatorWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/operator-with-institution';

export class OperatorWithInstitutionPresenter {
  static toHTTP(operator: OperatorWithInstitution) {
    return {
      id: operator.id.toString(),
      name: operator.name,
      email: operator.email,
      role: operator.role,
      status: operator.status,
      institutions: operator.institutions.map((institution) => {
        return {
          id: institution.id.toString(),
          name: institution.name,
        };
      }),
      createdAt: operator.createdAt,
      updatedAt: operator.updatedAt,
    };
  }
}
