import { MovimentationDetails } from '@/domain/pharma/enterprise/entities/value-objects/movimentation-details'

export class MovimentationPresenter {
  static toHTTP(movimentation: MovimentationDetails) {
    return {
      direction: movimentation.direction === 'ENTRY'
        ? 'ENTRADA'
        : 'SAÍDA',
      medicine: movimentation.medicine,
      batchCode: movimentation.batchCode,
      complement: movimentation.complement,
      dosage: movimentation.dosage,
      pharmaceuticalForm: movimentation.pharmaceuticalForm,
      unitMeasure: movimentation.unitMeasure,
      stock: movimentation.stock,
      movementDate: movimentation.movementDate,
      movementType: movimentation.movementType === 'DISPENSATION'
        ? 'DISPENSA'
        : movimentation.movementType === 'EXPIRATION'
          ? 'VENCIMENTO'
          : movimentation.movementType,
      operator: movimentation.operator,
      quantity: movimentation.quantity,
    }
  }
}
