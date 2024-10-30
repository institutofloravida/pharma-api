import { Operator } from '@/domain/pharma/enterprise/entities/operator'

export class OperatorPresenter {
  static toHTTP(operator: Operator) {
    return {
      id: operator.id.toString(),
      name: operator.name,
      email: operator.email,
      role: operator.role,
      createdAt: operator.createdAt,
      updatedAt: operator.updatedAt,
    }
  }
}
