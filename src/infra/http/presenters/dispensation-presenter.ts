import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'

export class DispensationPresenter {
  static toHTTP(dispensation: Dispensation) {
    return {
      id: dispensation.id.toString(),
      dispensationDate: dispensation.dispensationDate,
      patientId: dispensation.patientId,
      createdAt: dispensation.createdAt,
      quantity: dispensation.totalQuantity,
    }
  }
}
